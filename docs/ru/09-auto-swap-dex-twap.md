# 9. Auto-Swap Logic: Интеграция с DEX, TWAP-оракулы и Конвертация USDC в $AIFA

Контракт AifaPaymaster.sol выступает финансовым мостом между стейблкоин-экономикой ИИ-агентов (USDC) и токеномикой базового протокола ($AIFA). Когда Paymaster принимает USDC от агента за покрытие газа и комиссии эскроу, он не просто накапливает стейблкоины на балансе. Контракт включает автоматизированный модуль обменной логики (Auto-Swap Module), интегрированный с децентрализованными биржами (DEX Uniswap v3/v4).

Этот модуль решает ключевую задачу: превращает входящие комиссии в покупку токена $AIFA без создания риска проскальзывания цены (Slippage) и без уязвимости к манипуляциям оракулами.

## 9.1 Архитектура взаимодействия Paymaster, DEX и Oracle

```
[ИИ-Агент]
   │ (Оплата в USDC)
   ▼
[AifaPaymaster.sol] ◄────── [TWAP Oracle (Uniswap v3/v4)]
   │                            (Запрос средневзвешенной цены за 30 мин)
   ├─► 1. Проверка лимитов проскальзывания (Max Slippage Threshold)
   ├─► 2. Конвертация накопившихся USDC ──► [Uniswap V3 Pool: USDC/$AIFA]
   │                                                    │
   └─► 3. Перевод выкупленных $AIFA ────────────────────┴──► [Proof-of-Burn / Treasury]
```

## 9.2 Расчет курса и защита через TWAP-оракулы (Time-Weighted Average Price)

Главная уязвимость обычных децентрализованных обменников при автоматических вызовах из смарт-контракта — чувствительность к спотовой цене (Spot Price). Если злоумышленник совершит крупную сделку (Flash Loan Attack) в пуле USDC/$AIFA перед вызовом конвертации Paymaster'ом, он сдвинет курс, заставив Paymaster купить $AIFA по завышенной цене.

Чтобы предотвратить это, AifaPaymaster.sol запрещает оперировать мгновенной спотовой ценой. Расчет стоимости газа и курса конвертации производится через TWAP-оракул (Time-Weighted Average Price) с геометрическим усреднением за заданный временной интервал (по умолчанию $T = 30\text{ минут}$).

Математика TWAP (Uniswap v3 Observation Cardinality):
Смарт-контракт опрашивает геометрический накопитель тиков (Tick Cumulatives) пула ликвидности:

$$\Delta \text{Tick} = \text{tickCumulative}(t_2) - \text{tickCumulative}(t_1)$$

$$\text{Tick}_{\text{TWAP}} = \frac{\Delta \text{Tick}}{t_2 - t_1}$$

$$\text{Price}_{\text{TWAP}} = 1.0001^{\text{Tick}_{\text{TWAP}}}$$

Свойства защиты: Чтобы сдвинуть 30-минутный TWAP хотя бы на 2%, атакующему придется удерживать искусственно завышенную цену в течение десятков блоков, расходуя миллионы долларов на удержание ликвидности от арбитражеров. Для атаки на Paymaster это становится экономически бессмысленным.

## 9.3 Логика работы модуля Auto-Swap в Solidity

Контракт разделяет процесс на две фазы: Оценка (Gas Valuation) и Исполнение (Batch Execution).

```solidity
// Упрощенный фрагмент логики Auto-Swap модуля внутри AifaPaymaster.sol
contract AifaPaymaster is IPaymaster, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IUniswapV3Pool public immutable swapPool;
    address public immutable aifaToken;
    address public immutable usdcToken;
    
    uint32 public constant TWAP_WINDOW = 1800; // 30 минут (1800 сек)
    uint256 public constant MAX_SLIPPAGE_BPS = 100; // Максимальное проскальзывание 1.0% (100 BPS)

    // 1. Оценка требуемого количества USDC на основе TWAP
    function getRequiredUsdcForGas(uint256 nativeGasCostInEth) public view returns (uint256 usdcAmount) {
        int24 twapTick = getTwapTick(address(swapPool), TWAP_WINDOW);
        uint256 aifaPerEth = getEthToAifaRate(); // Кросс-курс ETH -> $AIFA
        
        // Пересчет нативного газа сети в эквивалент USDC с учетом буфера риска (+5%)
        usdcAmount = uint256(OracleLibrary.getQuoteAtTick(
            twapTick,
            uint128(nativeGasCostInEth * aifaPerEth),
            address(aifaToken),
            address(usdcToken)
        )) * 105 / 100;
    }

    // 2. Выполнение конвертации накопившегося пула USDC
    function _executeBatchSwap(uint256 usdcToSwap) internal returns (uint256 aifaBought) {
        uint256 minAifaOutput = getExpectedAifaOutput(usdcToSwap) * (10000 - MAX_SLIPPAGE_BPS) / 10000;

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: usdcToken,
            tokenOut: aifaToken,
            fee: 3000, // Пул 0.3%
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: usdcToSwap,
            amountOutMinimum: minAifaOutput, // Жесткий лимит проскальзывания
            sqrtPriceLimitX96: 0
        });

        IERC20(usdcToken).forceApprove(address(swapRouter), usdcToSwap);
        aifaBought = swapRouter.exactInputSingle(params);
    }
}
```

## 9.4 Буферизация и динамический расчет проскальзывания (Slippage Tolerance)

Если Paymaster попытается обменять большой объем USDC в пуле с низкой ликвидностью, сработает защита от проскальзывания (amountOutMinimum), и транзакция откатится.

Для предотвращения этого в модуль заложены 3 правила:

Динамический кэп сделки (Max Swap Cap): Объём отдельной конвертации не может превышать 0.5% от всей ликвидности (Depth), находящейся в активном диапазоне цен пула Uniswap v3. Если накопленная сумма USDC больше — сделка автоматически разбивается на несколько батчей.

Использование пулов с концентрированной ликвидностью (Uniswap v3 Range Orders): Протокол мотивирует операторов ликвидности держать узкие ценовые диапазоны вокруг текущей цены TWAP, предоставляя дополнительные награды из фонда Liquidity Mining.

Fallback на альтернативные пулы (Multi-hop Swaps): Если прямая пара USDC/$AIFA имеет высокую волатильность, роутер Paymaster'а автоматически перенаправляет обходной маршрут: USDC -> WETH -> $AIFA.

## 9.5 Бесшовная дефляционная спираль для экосистемы

Благодаря этой логике создается устойчивый экономический цикл:

ИИ-агенты совершают миллионы запросов, расплачиваясь привычным USDC.

AifaPaymaster.sol сглаживает скачки цен через 30-минутный TWAP и переводит USDC в покупку $AIFA на открытом рынке.

Каждая операция конвертации покупает $AIFA прямо из пула ликвидности, отправляя выкупленные токены в модуль сжигания (Proof-of-Burn).

Итог: Чем выше активность автономных ИИ-агентов в сети, тем выше постоянный органический спрос и дефляционное изъятие токенов $AIFA из обращения.
