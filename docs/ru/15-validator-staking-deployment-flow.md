# 15. Node Operator Guide: Стейкинг Валидатора и Пошаговый Процесс Интеграции (Deployment Flow)

Процесс активации Супер-Узла в сети AIFA Network требует жесткой синхронизации между подготовкой физической/виртуальной инфраструктуры, генерацией криптографических ключей P2P-идентификации (NodeID) и ончейн-внесением гарантийного залога в смарт-контракт ValidatorStaking.sol.

Ниже описан полный пошаговый алгоритм ввода узла в эксплуатацию — от чистого сервера до включения в таблицу маршрутизации Kademlia DHT.

## 15.1 Общий сквозной процесс запуска (Deployment Flow Pipeline)

Активация Супер-Узла состоит из пяти последовательных этапов:

```
[ Этап 1: Подготовка сервера ] ──► [ Этап 2: Генерация Node Key ]
                                              │
                                              ▼
[ Этап 4: Прохождение On-Chain ] ◄── [ Этап 3: Депонирование стейка ]
  Инициализации (Staking)             в ValidatorStaking.sol
          │
          ▼
[ Этап 5: Запуск ноды и прохождение ] ──► [ Статус: ACTIVE VALIDATOR ]
  P2P-Handshake в Kademlia DHT
```

## 15.2 Шаг 1: Подготовка операционной системы и зависимостей

На выделенном сервере (Ubuntu 24.04 LTS / Debian 12) устанавливаются базовые зависимости, среда выполнения контейнеров Docker, а также утилита CLI aifanode.

```bash
# Update system and install base dependencies
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git build-essential ufw jq fail2ban

# Install Docker Engine & Docker Compose Plugin
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install CLI tool for AIFA Network Node Operators
curl -fsSL https://get.aifa.dev/cli/install.sh | bash
source ~/.bashrc

# Verify installation
aifanode --version
```

## 15.3 Шаг 2: Криптографическая инициализация и Вычисление Node ID

Узел генерирует секьюрный ключ P2P-сессии (secp256k1). Идентификатор NodeID детерминированно привязывается к EVM-адресу, с которого будет производиться стейкинг.

```bash
# Генерация нового изолированного ключа P2P-идентификации узла
aifanode identity create --keyfile /etc/aifa/node_key.json

# Вывод сгенерированных реквизитов узла
aifanode identity show --keyfile /etc/aifa/node_key.json
```

Пример консольного вывода:

```
===================================================================
AIFA Network Node Identity Generated
===================================================================
Node Public Address (EVM) : 0x71cB49E820f92b76a08f51A0fB221B4561a3b49E
Computed P2P Node ID       : 0x892a0149f82d1c238b7122a019e1f2a34bc1a82e9123812a0f819231f8291a82
Required Minimum Stake     : 5000 AIFA (Tier-2 Super-Relay)
Status                     : NOT_STAKED (Pending On-Chain Stake)
===================================================================
```

## 15.4 Шаг 3: Депонирование стейка в ValidatorStaking.sol

Оператор с кошелька, указанного в выводе (или через мультиподписной кошелек / Hardware Wallet), производит одобрение (Approve) и транзакцию блокировки залога в сети L2 (Arbitrum / Base).

CLI Скрипт внесения стейка:

```bash
# 1. Approve токенов AIFA для контракта стейкинга
aifanode staking approve \
  --token-address 0xAifaTokenAddressOnArbitrum \
  --staking-address 0xValidatorStakingContractAddress \
  --amount 5000 \
  --private-key $OPERATOR_PRIVATE_KEY \
  --rpc-url https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY

# 2. Вызов функции registerValidator() в смарт-контракте
aifanode staking deposit \
  --staking-address 0xValidatorStakingContractAddress \
  --node-id 0x892a0149f82d1c238b7122a019e1f2a34bc1a82e9123812a0f819231f8291a82 \
  --tier 2 \
  --amount 5000 \
  --private-key $OPERATOR_PRIVATE_KEY
```

Solidity Механика под капотом ValidatorStaking.sol:

Смарт-контракт проверяет транзакцию, фиксирует залог и переводит статус адреса в состояние STAKED:

```solidity
function registerValidator(bytes32 nodeId, uint8 tier, uint96 amount) external nonReentrant {
    require(amount >= MIN_STAKE_TIER_2, "ValidatorStaking: Stake below minimum");
    require(validators[msg.sender].stakeBalance == 0, "ValidatorStaking: Already registered");

    // Перевод токенов AIFA на баланс контракта стейкинга
    aifaToken.safeTransferFrom(msg.sender, address(this), amount);

    // Запись параметров узла в блокчейн
    validators[msg.sender] = Validator({
        stakeBalance: amount,
        lastActive: uint40(block.timestamp),
        slashCount: 0,
        isJailed: false,
        pubKeyAddress: msg.sender
    });

    nodeIdToAddress[nodeId] = msg.sender;
    emit ValidatorRegistered(msg.sender, nodeId, amount, tier);
}
```

## 15.5 Шаг 4: Настройка конфигурации node.toml

Оператор формирует рабочий конфигурационный файл узла /etc/aifa/node.toml:

```toml
[node]
tier = 2
node_id = "0x892a0149f82d1c238b7122a019e1f2a34bc1a82e9123812a0f819231f8291a82"
keyfile_path = "/etc/aifa/node_key.json"
data_dir = "/var/lib/aifa/data"

[network]
public_ip = "203.0.113.195" # Статичный IPv4 адрес сервера
p2p_port = 4001             # Kademlia UDP
mtls_port = 443             # Envoy Data Plane TCP
stun_turn_port = 3478       # NAT Traversal

[blockchain]
chain_id = 42161            # Arbitrum One
rpc_url = "https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY"
staking_contract = "0xValidatorStakingContractAddress"
escrow_contract = "0xA2AEscrowContractAddress"

[relay]
enable_turn_relay = true
max_bandwidth_mbps = 1000
relay_fee_per_mb_usdc = "0.000100" # Начисление комиссии за проксирование

[metrics]
enabled = true
prometheus_port = 9090
```

## 15.6 Шаг 5: Запуск службы и Первичное Рукопожатие (P2P Handshake)

Узел запускается как системная служба, производит ончейн-верификацию своего стейка и рассылает PING сообщения ближайшим bootstrap-узлам сети Kademlia DHT.

```bash
# Запуск узла через CLI
aifanode service start --config /etc/aifa/node.toml

# Проверка статуса сетевой интеграции
aifanode status
```

Пример успешного вывода:

```
● aifa-node.service - AIFA Network Super-Relay Daemon
     Loaded: loaded (/etc/systemd/system/aifa-node.service; enabled)
     Active: active (running) since Fri 2026-10-09 18:01:00 WEST; 12s ago

[INFO] On-Chain Stake Verified: 5000 AIFA (Tx: 0x3f1a...b92)
[INFO] P2P Transport initialized on 203.0.113.195:4001 (UDP)
[INFO] Envoy mTLS Sidecar started on 203.0.113.195:443 (TCP)
[INFO] Connecting to Bootstrap Nodes...
[INFO] Handshake successful with 12 Core Relays. Joined Kademlia Bucket #256.
[SUCCESS] Node is ACTIVE and routing A2A traffic.
```
