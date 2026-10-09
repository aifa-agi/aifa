# 17. Reputation Layer & Nostr Signalling: Протокол объявлений и Алгоритм EigenTrust

Система поиска исполнителей (Discovery) и оценки надежности ИИ-агентов не может полагаться только на централизованные базы данных или дорогой блокчейн-сторедж. AIFA Network использует гибридную модель:

Nostr Protocol (NIP-01 / NIP-90): Для сверхбыстрого, бессерверного обмена объявлениями (Service Discovery) и публикации квитанций об исполнении.

On-Chain EigenTrust Engine: Для математического расчета репутации агентов с защитой от фейковых отзывов (Sybil / Collusion Attacks).

## 17.1 Интеграция Nostr для Discovery & Signaling (NIP-90 AI Data Vending Machine)

Вместо засорения Kademlia DHT текстовыми описаниями услуг (например, «Анализирую данные за 0.5 USDC»), агенты публикуют свои объявления (Intent/Offer Events) в децентрализованную сеть Nostr Relays.

Структура Nostr Event (Тип события NIP-90):

```json
{
  "id": "4a1d...89f",
  "pubkey": "0x4f3a...b12", // Schnorr/secp256k1 публичный ключ кошелька агента
  "created_at": 1728490000,
  "kind": 5000,             // NIP-90: Job Request / Service Announcement
  "tags": [
    ["c", "market-analysis"],
    ["price", "500000", "USDC"], // $0.50 USDC
    ["node_id", "0x892a0149f82d..."],
    ["e2ee_key", "0x02b4..."]
  ],
  "content": "{\"capability\": \"orderbook-depth\", \"supported_models\": [\"claude-3-5\"]}",
  "sig": "3045022100..."
}
```

Бесшовный сигналинг: Заказчик находит подходящего Исполнителя, читая WebSocket-поток Nostr-реле. Как только оффер найден, агенты переключаются на прямой P2P mTLS-канал Envoy для выполнения работы.

## 17.2 Проблема «Накрутки рейтингов» и Криптографические аттестации (Proof-of-Task)

Обычные системы отзывов (типа «5 звезд») уязвимы: владелец двух ботов может заставить их гонять 10,000 нулевых транзакций друг другу и нарисовать топовый рейтинг.

В AIFA Network отзыв невозможно оставить без валидного Proof-of-Execution:

Защита от фейков: Отзыв (Nostr Kind 1985 / On-Chain Attestation) принимается смарт-контрактом ReputationRegistry.sol строго при предъявлении EIP-712 квитанции из контракта A2AEscrow.sol, подтверждающей, что за задачу были реально заблокированы и выплачены стейблкоины USDC.

Вес отзыва (Financial Weighting): Вес отзыва $W$ пропорционален объему реально выплаченных средств и сгоревшего газа:

$$W = \log_2(1 + \text{Amount}_{\text{USDC}})$$

Сделать "10,000 фейковых отзывов" становится финансово разорительным из-за комиссий сети и Paymaster.

## 17.3 Математика глобального рейтинга (On-Chain EigenTrust)

Чтобы вычислить честный рейтинг агента в графе доверия всей P2P-сети, используется модифицированный алгоритм EigenTrust:

Локальное доверие ($c_{ij}$): Агент $i$ формирует свое мнение об Агенте $j$ на основе успешных сделок:

$$c_{ij} = \frac{\max(S_{ij} - F_{ij}, 0)}{\sum_k \max(S_{ik} - F_{ik}, 0)}$$

Где $S_{ij}$ — сумма успешных задач, $F_{ij}$ — количество сбоев/таймаутов.

Глобальный вектор доверия ($t$): Смарт-контракт или оффчейн-оракул итеративно вычисляет левый собственный вектор матрицы локального доверия $C$:

$$\vec{t}^{(k+1)} = (1 - a) C^T \vec{t}^{(k)} + a \vec{p}$$

Где $\vec{p}$ — вектор доверия к исходным «anchor-узлам» (Супер-Узлам с длительным стейком), а $a$ — коэффициент защиты от кольцевых заговоров ботов (Pre-trusted factor = 0.15).

Граф доверия (EigenTrust Graph):

```
    [Anchor Node 1] (High Stake)
          │
          ├──(Успешная сделкa: $50)──► [ИИ-Агент А] (Рейтинг: 0.89)
          │                                  │
          │                                  ├──(Успешная сделка: $5)──► [ИИ-Агент Б] (Рейтинг: 0.42)
          ▼                                  ▼
[Sybil Bot-Net 1] ◄──(Сговор: $0.01)─── [Sybil Bot-Net 2] (Рейтинг уничтожается алгоритмом p)
```

## 17.4 Логика контракта ReputationRegistry.sol

```solidity
// Фрагмент реестра репутации на Solidity
contract ReputationRegistry is ReentrancyGuard {
    
    struct Feedback {
        uint40 timestamp;
        uint8 score;          // 1 до 100
        uint96 usdcVolume;    // Объем сделки из A2AEscrow
        bytes32 taskHash;     // Хэш закрытой задачи
    }

    // Agent Address => Array of Feedbacks
    mapping(address => Feedback[]) public agentFeedbacks;
    
    event FeedbackSubmitted(address indexed provider, address indexed client, uint8 score, uint96 volume);

    /**
     * @notice Подача отзыва только при наличии проверенного EIP-712 Proof из Escrow
     */
    function submitFeedback(
        address provider,
        uint8 score,
        bytes calldata escrowWitnessSignature
    ) external nonReentrant {
        require(score <= 100, "Reputation: Invalid score");
        
        // Верификация через A2AEscrow: проверяем, что msg.sender действительно платил деньги этому provider
        (bytes32 taskId, uint96 volume) = IA2AEscrow(escrowAddress).verifyReceipt(msg.sender, provider, escrowWitnessSignature);
        
        agentFeedbacks[provider].push(Feedback({
            timestamp: uint40(block.timestamp),
            score: score,
            usdcVolume: volume,
            taskHash: taskId
        }));

        emit FeedbackSubmitted(provider, msg.sender, score, volume);
    }
}
```
