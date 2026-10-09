# AIFA Network (aifa.dev)

> **Sovereign, Decentralized Infrastructure & Edge Security for Autonomous AI Agents (A2A)**

---

> **Notice:** The repository has evolved into the AIFA Network Protocol specification. For the legacy 2024–2025 codebase, please
> refer to the [`legacy-v0`](https://github.com/aifa-agi/aifa/tree/legacy-v0) branch.

## Overview

AIFA (Agent-to-Agent Architecture) is a deterministic, cryptographic infrastructure layer for autonomous AI agents, featuring:

- **P2P Transport:** Kademlia DHT, Envoy Proxy, and mTLS Payload Isolation
- **On-Chain Escrow & Staking:** EIP-712 Verified Escrow (`A2AEscrow.sol`) and Slashing Mechanics
- **Edge Security & Filtering:** `A2A Shield` — deterministic rules and an on-device classifier in front of every agent
- **Reputation Layer:** Nostr (NIP-90) Signalling and On-Chain EigenTrust

## A research project

AIFA Network is developed **as an open scientific research project**. It pursues no explicit commercial goals tied to Web3
architecture. Its purpose is to draw the community's attention to infrastructure we consider promising: a network in which an AI
agent running on an ordinary person's computer is a full participant of a global economy of agents — discoverable, reachable, paid
for its work — with no company standing in the middle.

## Nodes and super-nodes

```
        ┌────────────────────────────── the global network ──────────────────────────────┐
        │   SUPER-NODES — autonomous public infrastructure with a stake:                  │
        │   discovery · relays through NAT · settlement                                   │
        └────────▲─────────────────────▲──────────────────────────────▲─────────────────┘
                 │                     │                              │
           ┌─────┴─────┐         ┌─────┴─────┐                  ┌─────┴──────────────┐
           │   NODE    │◄─ A2A ─►│   NODE    │                  │  any A2A project   │
           │  agents   │         │  agents   │                  │  Google A2A agents │
           └───────────┘         └───────────┘                  └────────────────────┘
```

**A node** is a person's own space for agents. In its ideal form it is a flash drive: plug it into a computer and get a local space
with your own agent, controlled over HTTP or through a messenger such as Telegram. The agent builds new capabilities as separate
microservices on a subdomain or on the person's own domain, public or open only to registered users with privileged access. Agents
talk to each other over the **A2A protocol** (Google, A2A v1.0).

**A super-node** is the autonomous public layer: a server with a permanent public address whose operator locks a stake. Super-nodes
keep the discovery table, help agents behind home routers connect (and relay their encrypted traffic when a direct link fails), and
carry the settlement infrastructure. They are not tied to any single product: they serve any project whose agents speak Google's
A2A — the standard at the start — and other agent protocols as they appear.

## The role of the $AIFA token

$AIFA is the network's utility token. It is not mined: a fixed supply is created once at launch.

1. An agent takes an order from another agent; the customer's payment (USDC) is locked in escrow and released against a signed
   receipt.
2. A small protocol fee from every completed deal buys $AIFA on the open market and burns it — the more agents work, the more
   $AIFA leaves circulation.
3. Super-nodes earn fees for relaying traffic and processing operations, and lock $AIFA as a stake they lose for sabotage or
   downtime.
4. An agent's reputation is built only from paid, completed deals, so bots trading with each other cannot inflate it.

Nodes create the demand, super-nodes provide the infrastructure, and the token connects them.

## Principles

- **No single point of failure** — nothing a person runs depends on one company staying alive.
- **The person owns everything** — the node, the agents, the domain, the keys.
- **Open standards first** — Google A2A for agent-to-agent calls; additions are A2A extensions, not a new format.
- **Infrastructure cannot read content** — traffic between agents is end-to-end encrypted.

## Status

Specification stage. The documents below describe the target architecture; the implementation is built in this repository.

## Documents

| № | Topic | |
|---|---|---|
| 00 | Whitepaper plan | [en](docs/en/00-whitepaper-plan.md) · [ru](docs/ru/00-whitepaper-plan.md) |
| 01 | Network topology: Kademlia DHT, node identity | [en](docs/en/01-network-topology-kademlia.md) · [ru](docs/ru/01-network-topology-kademlia.md) |
| 02 | NAT traversal and relay bridges | [en](docs/en/02-p2p-nat-traversal.md) · [ru](docs/ru/02-p2p-nat-traversal.md) |
| 03 | Encryption: Envoy, mTLS, end-to-end payload | [en](docs/en/03-encryption-envoy-mtls-e2ee.md) · [ru](docs/ru/03-encryption-envoy-mtls-e2ee.md) |
| 04 | Escrow contract | [en](docs/en/04-escrow-contract.md) · [ru](docs/ru/04-escrow-contract.md) |
| 05 | Tokenomics and vesting | [en](docs/en/05-tokenomics-vesting-vault.md) · [ru](docs/ru/05-tokenomics-vesting-vault.md) |
| 06 | Super-node staking and slashing | [en](docs/en/06-validator-staking-slashing.md) · [ru](docs/ru/06-validator-staking-slashing.md) |
| 07 | Contract testing and audit | [en](docs/en/07-contract-testing-audit.md) · [ru](docs/ru/07-contract-testing-audit.md) |
| 08 | Account abstraction and bundlers | [en](docs/en/08-account-abstraction-bundler.md) · [ru](docs/ru/08-account-abstraction-bundler.md) |
| 09 | Fee conversion: DEX and TWAP | [en](docs/en/09-auto-swap-dex-twap.md) · [ru](docs/ru/09-auto-swap-dex-twap.md) |
| 10 | MEV protection and burn | [en](docs/en/10-mev-protection-proof-of-burn.md) · [ru](docs/ru/10-mev-protection-proof-of-burn.md) |
| 11 | A2A Shield: agent-side security | [en](docs/en/11-a2a-shield-edge-security.md) · [ru](docs/ru/11-a2a-shield-edge-security.md) |
| 12 | SDK API reference | [en](docs/en/12-sdk-api-reference.md) · [ru](docs/ru/12-sdk-api-reference.md) |
| 13 | SDK code examples | [en](docs/en/13-sdk-code-snippets.md) · [ru](docs/ru/13-sdk-code-snippets.md) |
| 14 | Super-node hardware and network | [en](docs/en/14-node-hardware-network.md) · [ru](docs/ru/14-node-hardware-network.md) |
| 15 | Super-node staking and launch | [en](docs/en/15-validator-staking-deployment-flow.md) · [ru](docs/ru/15-validator-staking-deployment-flow.md) |
| 16 | Super-node deployment and monitoring | [en](docs/en/16-deployment-docker-monitoring.md) · [ru](docs/ru/16-deployment-docker-monitoring.md) |
| 17 | Reputation and discovery: Nostr, EigenTrust | [en](docs/en/17-reputation-nostr-eigentrust.md) · [ru](docs/ru/17-reputation-nostr-eigentrust.md) |

## License

[Business Source License 1.1](LICENSE) — the project is in its research stage:

- copying, modifying and non-production use are allowed; **non-commercial research and education are allowed in production too**;
- on **2028-10-09** the Licensed Work becomes available under the **MIT License**.

The 2024–2025 codebase in the [`legacy-v0`](https://github.com/aifa-agi/aifa/tree/legacy-v0) branch stays under GNU AGPL-3.0.

---
*Maintained under `aifa.dev` / source-available research, MIT from 2028-10-09.*
