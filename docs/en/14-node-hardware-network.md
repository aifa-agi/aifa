# 14. Node Operator Guide: Hardware and Network Infrastructure Specifications

The resilience, throughput and latency of the AIFA Network network depend directly on the configuration of the hardware on which Super-Nodes (Core Relays) and TURN bridges are deployed. Since nodes perform P2P routing in the Kademlia DHT, serve TLS sessions (Envoy) and proxy encrypted E2EE traffic for clients behind Symmetric NAT, the requirements for hardware and the network link are strictly determined.

This section describes the official hardware profiles for operators who want to put up a guarantee stake and earn bandwidth fees (Relay Gas Fee).

## 14.1 Node Tier Profiles

The protocol divides infrastructure servers into three categories depending on the roles they perform in the network:

| Node profile | Purpose and role | Min. stake ($AIFA) | Target load |
|---|---|---|---|
| Tier-1: Discovery Node | Serving the Kademlia DHT, storing k-bucket tables, looking up addresses and signatures of agents. | $1,000$ $AIFA | Low traffic, high-frequency UDP requests. |
| Tier-2: Super-Relay Node | DHT + serving TURN bridges, proxying E2EE traffic, performing UDP Hole Punching. | $5,000$ $AIFA | High traffic, parallel mTLS sessions, high I/O load. |
| Tier-3: Enterprise Bundler & Relay | Full stack: DHT + TURN + Bundler (ERC-4337) + local L2 Full Node (Arbitrum/Base). | $25,000$ $AIFA | Maximum routing priority, sending UserOps to private RPCs. |

## 14.2 Minimum and Recommended System Requirements

To ensure a zero packet drop rate and pass regular uptime checks (PING) from neighboring nodes, operators' servers must meet the following hardware specifications:

**Tier-2: Super-Relay Node (Standard operator profile)**

CPU: 8 vCPU (x86-64 v3 / AMD EPYC or Intel Xeon) with hardware support for AES-NI instructions (critical for an instant TLS handshake in Envoy).

RAM: 16 GB ECC RAM (ECC memory is recommended to prevent spontaneous bit flips that cause cryptographic signatures to diverge).

Storage: 500 GB NVMe SSD (PCIe Gen4, minimum 3000 MB/s Read/Write). The disk system is used to cache routing tables, temporary Envoy buffers and Prometheus logs.

Network Bandwidth: Dedicated 1 Gbps Unmetered (Simplex/Duplex). Bandwidth is the node's main resource. Servers with limited traffic (Metered) are strongly discouraged.

Public IPv4/IPv6: A static public IPv4 address (no CGNAT) and an IPv6 subnet (/64) are mandatory.

**Tier-3: Enterprise Bundler & Relay (Professional validator)**

CPU: 16–32 vCPU (AMD EPYC 7003/9004 series or Ampere Altra MAX ARM64).

RAM: 64 GB – 128 GB DDR5.

Storage: 2 TB NVMe SSD (Enterprise Grade: DWPD $\ge 1$).

Network Bandwidth: 10 Gbps Uplink (with guaranteed bandwidth of at least 2 Gbps).

## 14.3 Network Configuration and Firewall (Port Matrix)

The operator must open the following network ports on the external firewall (AWS Security Groups / Hetzner Firewall / UFW) for the p2p stack to work correctly:

```
                  ┌─────────────────────────────────────────┐
                  │          NETWORK FIREWALL (UFW)         │
                  └─────────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
  [Port 4001 UDP]               [Port 443 TCP]              [Port 3478 UDP/TCP]
 Kademlia DHT Discovery         Envoy mTLS Data Plane          STUN/TURN NAT Traversal
 (P2P address lookup)           (Encrypted traffic)            (Breaking through firewalls)
```

| Port | Protocol | Direction | Purpose in the AIFA Network architecture |
|---|---|---|---|
| 4001 | UDP | Inbound/Outbound | Kademlia DHT Engine: Node lookup, exchange of PING/STORE messages. |
| 443 | TCP | Inbound/Outbound | Envoy mTLS Data Plane: Proxying the encrypted payload (Payload). |
| 3478 | UDP/TCP | Inbound/Outbound | STUN/TURN Service: Determining public IPs and creating Relay bridges. |
| 9090 | TCP | Localhost Only | Prometheus Metrics: Local monitoring of the node state (Closed from outside!). |

## 14.4 Geographic Distribution and Latency SLA

To minimize latency when passing packets between AI agents, the network distributes rewards (Relay Gas Fee) taking the node's geolocation into account:

Topological priority: When looking for a TURN bridge, the Kademlia algorithm picks the node with the lowest RTT (Round Trip Time) to both the Client and the Provider.

Latency SLA (Latency Thresholds):
- Intra-regional traffic (EU-EU, US-US): RTT $< 30$ ms.
- Transcontinental traffic (EU-US, ASIA-EU): RTT $< 120$ ms.

Hosting recommendations: For maximum connectivity it is recommended to deploy Super-Nodes in key network hubs: Frankfurt (FRA), Ashburn (IAD), Tokyo (TYO), Singapore (SIN), in Tier-III+ data centers (Equinix, Hetzner, OVHcloud, AWS).
