# 1. Network Topology: Kademlia DHT, Node ID and Routing Algorithms

The decentralized transport engine of AIFA Network is built on a modified Kademlia protocol. The standard Kademlia implementation is vulnerable to Sybil attacks, so our architecture rigidly binds P2P identifiers to Web3 staking. This creates a financial barrier to entering the routing table.

## 1.1 Node ID Generation and Crypto-Economic Binding

In classic P2P networks (for example, BitTorrent), nodes generate random 160-bit or 256-bit identifiers. In AIFA Network this is strictly forbidden.

The Super-Node identifier (NodeID) is deterministically computed from the public key of the wallet (Ethereum/EVM-compatible) from which the guarantee deposit was made into the ValidatorStaking.sol smart contract.

Formula: $NodeID = \text{SHA3-256}(PublicKey_{EVM})$

Handshake validation: When Node A tries to connect to Node B, it sends its NodeID and a cryptographic signature proving ownership of the private key. Node B takes the public key, queries a blockchain RPC node and checks: stakeBalance(PublicKey) >= MIN_STAKE.

Result: If there is no stake, the connection is dropped instantly at the socket level. An attacker physically cannot fill the network with a million fake NodeIDs, because each one requires a real financial deposit.

## 1.2 Routing Mathematics (XOR Metric)

Request routing between AI agents relies on computing the logical exclusive OR (XOR) between identifiers. This makes it possible to determine the "distance" between nodes in a virtual 256-bit space.

Distance: $d(x, y) = x \oplus y$

Properties: The XOR metric is symmetric ($d(x,y) = d(y,x)$) and satisfies the triangle inequality. This means that a route from the Client to the Provider always converges in logarithmic time $\mathcal{O}(\log N)$, where $N$ is the number of Super-Nodes in the network.

In practice: If an agent needs to find a Node with ID 0xABCD..., it looks in its local table for nodes whose XOR with the target is minimal and forwards the request to them.

## 1.3 Routing Tables (K-Buckets)

Each Super-Node maintains a local routing table divided into buckets (k-buckets). In a 256-bit space there are 256 buckets.

Parameter $k$: Each bucket stores at most $k=20$ active nodes. This provides sufficient redundancy (if 19 nodes go down, 1 remains available).

Eviction policy: Kademlia gives preference to "old" nodes. If a bucket is full, the new node is placed in a waiting buffer. A PING is sent to the existing nodes. If one of them does not respond (500 ms timeout), it is removed and the new node takes its place. This protects the topology from DDoS attacks aimed at pushing honest nodes out of the tables.

## 1.4 P2P Message Lifecycle (RPC Methods)

Interaction inside the transport ring is built on 4 basic binary UDP messages:

| RPC Method | Purpose in the AIFA Network architecture |
|---|---|
| PING | Checks that a node is alive. Used to keep k-buckets up to date. |
| STORE | Writes metadata. The Provider agent publishes its IP, port and public encryption key (E2EE) on the $k$ closest Super-Nodes. |
| FIND_NODE | Requests a list of $k$ nodes closest to the target ID. Used to build the network map. |
| FIND_VALUE | Requests the IP address and keys of a specific AI agent to establish a direct secure connection. |

## 1.5 Integration with the Local Data Plane (Envoy)

In our architecture the Kademlia module plays the role of the Control Plane. It does not move the actual gigabytes of data between AI agents.

As soon as the DHT finds the IP address of the target agent via FIND_VALUE, this information is instantly passed over a local gRPC channel (xDS API) to Envoy Proxy, which then opens a high-speed mTLS tunnel to transfer the payload. This separation of logic (Discovery separately, Data Streaming separately) makes it possible to achieve microsecond latencies comparable to the best Web2 load balancers.
