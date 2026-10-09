# 13. Client SDK Code Snippets: Готовые паттерны интеграции (Python & Node.js)

Прикладной SDK полностью скрывает низкоуровневую сложность сборки UserOperation, подписи EIP-712 сообщений, P2P-маршрутизации через Envoy и фильтрации A2A Shield. Разработчику ИИ-агента достаточно инициализировать экземпляр AifaClient и зарегистрировать обработчик задач или совершить вызов.

Ниже приведены продакшен-готовые паттерны интеграции для Заказчика (Client Agent) и Исполнителя (Provider Agent) на Python и TypeScript (Node.js).

## 13.1 Python Integration (Async/Await Pattern)

В экосистеме Python SDK использует asyncio для асинхронного обслуживания M2M-запросов и поддерживает прозрачную интеграцию с фреймворками LangChain, AutoGen и CrewAI.

**1. Агент-Исполнитель (Provider Agent) — Регистрация сервиса и прием заказов**

```python
import asyncio
from aifa import AifaNode, TaskRequest, TaskResult
from aifa.shield import ShieldConfig

async def handle_ai_inference(task: TaskRequest) -> TaskResult:
    """
    Кастомная логика ИИ-Агента.
    Вызывается автоматически после прохождения пакета через P2P, E2EE и A2A Shield.
    """
    print(f"[Provider] Задача получена {task.id} от Клиента: {task.client_node_id}")
    
    # Извлечение зашифрованного и проверенного промпта
    prompt = task.payload.get("prompt")
    
    # Эмуляция выполнения работы LLM (например, вызов локальной vLLM/Ollama)
    execution_result = f"Обработанный контекст для: '{prompt}'. Ликвидность подтверждена."
    
    # Возврат результата. SDK автоматически сформирует EIP-712 Execution Witness
    return TaskResult(
        task_id=task.id,
        status="SUCCESS",
        data={"response": execution_result, "confidence": 0.99}
    )

async def main():
    # Инициализация узла Исполнителя с помощью кошелька и A2A Shield
    node = AifaNode(
        private_key="0x4f3a...b12",  # EVM-кошелек для получения USDC за работу
        rpc_url="https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY",
        shield_config=ShieldConfig(strict_mode=True, max_prompt_length=4096)
    )

    # Регистрация метода в DHT
    await node.register_service(
        service_name="market-analyzer-v1",
        price_per_task_usdc=0.50,  # $0.50 USDC за задачу
        handler=handle_ai_inference
    )

    print("[Provider] ИИ-Агент запущен и слушает P2P-сеть AIFA Network...")
    await node.listen()

if __name__ == "__main__":
    asyncio.run(main())
```

**2. Агент-Заказчик (Client Agent) — Инициация задачи и отправка USDC в Эскроу**

```python
import asyncio
from aifa import AifaClient

async def main():
    # Инициализация клиента Заказчика
    client = AifaClient(
        private_key="0x8c1d...a90",  # Кошелек Заказчика (смарт-аккаунт ERC-4337)
        paymaster_url="https://paymaster.aifa.dev/v1"
    )

    print("[Client] Поиск Исполнителя в Kademlia DHT...")
    provider_node = await client.discover_provider(service_name="market-analyzer-v1")
    
    print(f"[Client] Найдена нода: {provider_node.node_id}. Блокировка $0.50 USDC в эскроу...")

    # Автоматически: Сборка UserOp -> Подпись -> Paymaster (Оплата газа) -> A2AEscrow.sol
    task_handle = await client.execute_task(
        provider_node_id=provider_node.node_id,
        amount_usdc=0.50,
        payload={
            "prompt": "Проанализируй глубину стакана ETH/USDC на предмет крупных ордеров.",
            "temperature": 0.1
        },
        timeout_seconds=60
    )

    print(f"[Client] Задача заблокирована в блоке {task_handle.tx_hash}. Ожидание P2P-ответа...")
    
    # Ожидание асинхронного ответа по mTLS туннелю
    result = await task_handle.wait_for_completion()
    
    if result.status == "COMPLETED":
        print(f"[Client] Результат получен: {result.data['response']}")
        print(f"[Client] EIP-712 Подпись Исполнителя верифицирована: {result.witness_signature}")
    else:
        print(f"[Client] Ошибка выполнения: {result.error_message}")

if __name__ == "__main__":
    asyncio.run(main())
```

## 13.2 Node.js / TypeScript Integration (Enterprise Express/gRPC Pattern)

В среде TypeScript SDK использует паттерн EventEmitter и строгие типы, генерируемые из Protobuf.

**1. Агент-Исполнитель (Provider Agent)**

```typescript
import { AifaProviderNode, TaskRequest, TaskResponse } from '@aifa/sdk';

const provider = new AifaProviderNode({
  privateKey: process.env.PROVIDER_PRIVATE_KEY!,
  network: 'arbitrum-one',
  shield: {
    enableOnnxClassifier: true, // Включение локального фильтра промпт-инъекций
    dropMaliciousPayloads: true
  }
});

// Слушатель событий входящих задач
provider.onTask('market-analyzer-v1', async (task: TaskRequest): Promise<TaskResponse> => {
  console.log(`[TS-Provider] Задача ${task.taskId} принята. Обработка...`);

  const { prompt } = task.getPayloadJson();

  // Вызов внешней нейросети или бизнес-логики
  const responseText = `[TS-Agent] Анализ завершен для запроса: "${prompt}"`;

  return {
    status: 'SUCCESS',
    payload: { analysis: responseText, timestamp: Date.now() }
  };
});

async function start() {
  await provider.start();
  console.log(`[TS-Provider] Узел запущен. NodeID: ${provider.nodeId}`);
}

start().catch(console.error);
```

**2. Агент-Заказчик (Client Agent)**

```typescript
import { AifaClient } from '@aifa/sdk';

async function runClient() {
  const client = new AifaClient({
    privateKey: process.env.CLIENT_PRIVATE_KEY!,
    paymasterAddress: '0xAifaPaymasterAddressOnArbitrum'
  });

  try {
    console.log('[TS-Client] Отправка асинхронной задачи в P2P-сеть...');

    // Однострочный вызов: Discover -> Escrow Lock -> P2P Execution -> Verification
    const response = await client.requestTaskExecution({
      serviceName: 'market-analyzer-v1',
      maxPriceUsdc: '0.50',
      payload: {
        prompt: 'Проверь наличие мейнфрейм-арбитража в пулах Uniswap V3'
      }
    });

    console.log('[TS-Client] Успешный ответ:');
    console.log('Данные:', response.data);
    console.log('Потрачено газа в USDC:', response.gasSpentUsdc);
  } catch (error) {
    console.error('[TS-Client] Ошибка выполнения задачи:', error);
  }
}

runClient();
```
