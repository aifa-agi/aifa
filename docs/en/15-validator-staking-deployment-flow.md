# 15. Node Operator Guide: Validator Staking and the Step-by-Step Integration Process (Deployment Flow)

Activating a Super-Node in the AIFA Network network requires strict synchronization between preparing the physical/virtual infrastructure, generating the cryptographic P2P identity keys (NodeID) and depositing the guarantee stake on-chain into the ValidatorStaking.sol smart contract.

Below is the full step-by-step algorithm for putting a node into operation — from a clean server to inclusion in the Kademlia DHT routing table.

## 15.1 End-to-End Launch Process (Deployment Flow Pipeline)

Activating a Super-Node consists of five sequential stages:

```
[ Stage 1: Server preparation ] ──► [ Stage 2: Node Key generation ]
                                              │
                                              ▼
[ Stage 4: On-Chain Initialization ] ◄── [ Stage 3: Stake deposit ]
  (Staking)                               into ValidatorStaking.sol
          │
          ▼
[ Stage 5: Node launch and passing ] ──► [ Status: ACTIVE VALIDATOR ]
  the P2P Handshake in the Kademlia DHT
```

## 15.2 Step 1: Preparing the Operating System and Dependencies

On a dedicated server (Ubuntu 24.04 LTS / Debian 12), basic dependencies, the Docker container runtime and the aifanode CLI utility are installed.

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

## 15.3 Step 2: Cryptographic Initialization and Computing the Node ID

The node generates a secure P2P session key (secp256k1). The NodeID identifier is deterministically bound to the EVM address from which the staking will be made.

```bash
# Generate a new isolated P2P node identity key
aifanode identity create --keyfile /etc/aifa/node_key.json

# Print the generated node credentials
aifanode identity show --keyfile /etc/aifa/node_key.json
```

Example console output:

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

## 15.4 Step 3: Depositing the Stake into ValidatorStaking.sol

From the wallet shown in the output (or through a multisig wallet / Hardware Wallet), the operator performs an approval (Approve) and a stake-locking transaction on the L2 network (Arbitrum / Base).

Stake deposit CLI script:

```bash
# 1. Approve AIFA tokens for the staking contract
aifanode staking approve \
  --token-address 0xAifaTokenAddressOnArbitrum \
  --staking-address 0xValidatorStakingContractAddress \
  --amount 5000 \
  --private-key $OPERATOR_PRIVATE_KEY \
  --rpc-url https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY

# 2. Call the registerValidator() function in the smart contract
aifanode staking deposit \
  --staking-address 0xValidatorStakingContractAddress \
  --node-id 0x892a0149f82d1c238b7122a019e1f2a34bc1a82e9123812a0f819231f8291a82 \
  --tier 2 \
  --amount 5000 \
  --private-key $OPERATOR_PRIVATE_KEY
```

Solidity mechanics under the hood of ValidatorStaking.sol:

The smart contract checks the transaction, records the stake and moves the address status to STAKED:

```solidity
function registerValidator(bytes32 nodeId, uint8 tier, uint96 amount) external nonReentrant {
    require(amount >= MIN_STAKE_TIER_2, "ValidatorStaking: Stake below minimum");
    require(validators[msg.sender].stakeBalance == 0, "ValidatorStaking: Already registered");

    // Transfer AIFA tokens to the staking contract balance
    aifaToken.safeTransferFrom(msg.sender, address(this), amount);

    // Write node parameters to the blockchain
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

## 15.5 Step 4: Configuring node.toml

The operator creates the node's working configuration file /etc/aifa/node.toml:

```toml
[node]
tier = 2
node_id = "0x892a0149f82d1c238b7122a019e1f2a34bc1a82e9123812a0f819231f8291a82"
keyfile_path = "/etc/aifa/node_key.json"
data_dir = "/var/lib/aifa/data"

[network]
public_ip = "203.0.113.195" # Static IPv4 address of the server
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
relay_fee_per_mb_usdc = "0.000100" # Fee accrued for proxying

[metrics]
enabled = true
prometheus_port = 9090
```

## 15.6 Step 5: Starting the Service and the First Handshake (P2P Handshake)

The node starts as a system service, verifies its stake on-chain and sends PING messages to the nearest bootstrap nodes of the Kademlia DHT network.

```bash
# Start the node via CLI
aifanode service start --config /etc/aifa/node.toml

# Check the network integration status
aifanode status
```

Example of successful output:

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
