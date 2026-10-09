# 7. Тестирование и Аудит смарт-контрактов: Foundry, Slither и Fuzzing

Смарт-контракты протокола AIFA Network (A2AEscrow.sol, ValidatorStaking.sol, VestingVault.sol, Paymaster.sol) оперируют реальными финансовыми потоками в стейблкоинах и токенах $AIFA. Эксплойт на ончейн-слое смертелен: скомпрометированный смарт-контракт невозможно «пачануть» на лету без сложной процедуры Governance.

Для достижения уровня надежности Enterprise / Military Grade используется трехслойный конвейер тестирования и автоматизированного аудита (CI/CD Pipeline) на базе инструментария Foundry (Solidity-native) и статического анализатора Slither.

## 7.1 Юнит- и Интеграционное тестирование (Foundry Suite)

В отличие от устаревших фреймворков (Hardhat/Truffle на JavaScript), тестирование в Foundry пишется непосредственно на Solidity. Это исключает погрешности при сериализации типов и позволяет выполнять тесты со скоростью нативного кода на компилируемом уровне.

Ключевые сценарии тестового покрытия (Test Cases):

test_A2AEscrow_StateTransitions(): Проверка корректности переходов состояний контракта LOCKED -> COMMITTED -> COMPLETED и блокировка невалидных вызовов (например, попытка вызвать claimTimeout() до истечения окно DISPUTE_PERIOD).

test_EIP712_SignatureReplay(): Проверка защиты от повторного использования подписи (Replay Attack). Смарт-контракт должен отклонять идентичные подписи $v, r, s$ при изменении nonce или taskId.

test_VestingVault_CliffAndLinearCalculation(): Посекундная проверка формулы разблокировки токенов Архитектора через функции манипуляции временем Foundry (vm.warp()).

test_ValidatorStaking_SlashingDistribution(): Математическая проверка расщепления штрафа (50% сжигание $Proof-of-Burn$, 50% баунти репортеру) с точностью до 1 wei (без утери округления).

```solidity
// Пример Foundry-теста проверки Time-Lock в A2AEscrow.t.sol
function test_CannotClaimTimeoutBeforeDisputePeriod() public {
    vm.prank(client);
    escrow.lockFunds{value: 0}(taskId, provider, 100 * 106); // Lock 100 USDC

    vm.prank(provider);
    escrow.commitResult(taskId, resultHash);

    // Пытаемся забрать деньги через 2 минуты (до истечения 5-минутного лимита)
    vm.warp(block.timestamp + 2 minutes);
    
    vm.prank(provider);
    vm.expectRevert(A2AEscrow.DisputePeriodNotExpired.selector);
    escrow.claimTimeout(taskId); // Должно упасть с ошибкой!
}
```

## 7.2 Fuzzing и Свойства-Ориентированное Тестирование (Property-Based Invariants)

Обычные юнит-тесты проверяют только сценарии, о которых подумал разработчик. Fuzzing (Фаззинг) генерирует миллионы случайных псевдо-хаотичных входных данных (крайние значения uint256, нулевые адреса, гигантские суммы), пытаясь «сломать» математику контракта.

В Foundry мы настраиваем Invariant Tests (Тесты Инвариантов) — фундаментальные правила системы, которые никогда не должны нарушаться, независимо от последовательности транзакций:

Инвариант 1 (Solvency): Баланс USDC на контракте A2AEscrow.sol всегда должен быть строго равен или больше суммы всех заблокированных активных задач:

$$\text{Balance}_{\text{USDC}} \ge \sum \text{Task.amount}_{\text{LOCKED}}$$

Инвариант 2 (Vesting Cap): Сумма всех снятых токенов VestingVault за время $T$ не может превышать значение функции $Vested(T)$:

$$\text{TotalReleased} \le Vested(T)$$

Инвариант 3 (Staking Accounting): Сумма индивидуальных залогов всех валидаторов всегда равна общему значению totalStakedAmount в контракте стейкинга.

```solidity
// Foundry Invariant Test
function invariant_EscrowSolvency() public view {
    assertGe(
        usdc.balanceOf(address(escrow)), 
        escrow.totalLockedFunds(), 
        "CRITICAL: Escrow contract is insolvent!"
    );
}
```

## 7.3 Статический анализ и поиск уязвимостей (Slither AST)

В пайплайн сборки GitHub Actions интегрируется статический анализатор Slither. Он переводит Solidity-код в промежуточное представление (Slither IR) и анализирует абстрактное синтаксическое дерево (AST) на наличие стандартных Web3-уязвимостей.

Проверяемые векторы атак:

Reentrancy (Повторный вход):
Угроза: Злоумышленник вызывает функцию вывода средств из эскроу, и контрагент перехватывает управление до обновления баланса.
Защита: Использование паттерна Checks-Effects-Interactions и стандартных модификаторов ReentrancyGuard от OpenZeppelin.

Tx.origin Authentication:
Угроза: Использование tx.origin вместо msg.sender приводит к фишинговым атакам.
Защита: Slither алертит при любом упоминании tx.origin.

Unchecked Low-Level Calls:
Угроза: Необработанный результат .call() при переводе ERC-20/ETH.
Защита: Обязательное использование библиотеки SafeERC20.

Integer Overflow / Underflow:
Защита: Использование встроенных проверок Solidity 0.8.+ и строгое разделение типов (uint96, uint40) для бит-пакинга.

## 7.4 Конвейер непрерывной интеграции (CI/CD Pipeline)

Перед тем как любой Pull Request попадет в ветку main закрытого репозитория, автоматический бот запускает следующий строгий сценарий:

```
[ Git Push / PR ]
       │
       ├──> 1. forge fmt --check (Проверка форматирования кода)
       │
       ├──> 2. slither . --fail-on high|medium (Статический анализ)
       │
       ├──> 3. forge test --gas-report (Юнит-тесты + Gas Profiling)
       │
       └──> 4. forge test --fuzz-runs 10000 (Fuzzing инвариантов)
```

Если хотя бы 1 из 10,000 сгенерированных случайных вызовов в фаззинге вызовет критическую ошибку или разбалансировку инварианта — PR автоматически блокируется. Это гарантирует, что к моменту открытой публикации репозитория смарт-контракты будут оттестированы лучше, чем у большинства проектов на рынке.
