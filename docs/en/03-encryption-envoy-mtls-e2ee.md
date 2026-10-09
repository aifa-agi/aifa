# 3. Encryption and Proxying: Envoy Proxy, Web3-mTLS and E2EE Isolation

Separating discovery logic (the Control Plane, implemented through the Kademlia DHT) from data transfer (the Data Plane) is a classic pattern of high-load systems. In AIFA Network the role of the Data Plane is played by an integrated Envoy Proxy instance. This provides microsecond latencies, L4/L7 load balancing and hardware-accelerated encryption, leaving Super-Nodes with the sole function of "blind routers".

## 3.1 Envoy Proxy as the Data Plane (Sidecar Pattern)

Every AI agent (both client and provider) in the AIFA Network network is deployed together with a lightweight Envoy sidecar container.

Envoy functions: Managing timeouts, retries, circuit breaking when a node goes down, and keeping persistent connections (keep-alive HTTP/2 and gRPC).

Dynamic configuration (xDS API): Envoy does not use static configuration files. The local AIFA client (Control Plane) continuously polls the Kademlia DHT. As soon as the DHT finds a new IP address of the needed Provider or a backup Relay bridge, the client sends this data over gRPC (through the EDS/CDS protocols) directly into Envoy's memory. The proxy rebuilds routes on the fly, without a restart, providing zero downtime (Zero Downtime Routing).

## 3.2 Web3-Native mTLS (Mutual Authentication)

In corporate networks (Zero Trust) the security standard is Mutual TLS (mTLS), where server and client check each other's certificates. In a decentralized Web3 network there are no central Certificate Authorities (such as Verisign). AIFA Network solves this with elliptic-curve cryptography (secp256k1).

Ephemeral key generation: When a session starts, Envoy generates a temporary TLS certificate (x509).

Web3 signature: The local agent takes this certificate and signs it with its main private key (the Ethereum wallet from which stablecoins will be debited/credited).

Cryptographic handshake:

Agent A connects to Agent B.

They exchange certificates and Web3 signatures.

Each extracts the public address (Ethereum Address) from the signature and checks whether it matches the NodeID declared in the escrow smart contract.

Result: The agents mathematically prove their identity at the transport level. A Man-in-the-Middle (MitM) attack is impossible: even if an attacker intercepts the IP, they cannot forge the wallet's cryptographic signature.

## 3.3 E2EE and Payload Isolation (Payload Blindness)

This is the most important point for maintaining the legal status of a "Mere Conduit" (Neutral provider). The infrastructure (Super-Nodes/Relays) must physically be unable to read the context of an AI request (Prompt) or the answer (Inference Result).

A multi-layer envelope architecture (Onion-lite routing) is used:

Outer layer (Transport): Envoy encapsulates packets in a standard TLS 1.3 tunnel to the Super-Node. The Super-Node sees only headers: sender IP, recipient IP, packet size. This meta-information is used by the Paymaster smart contract to charge the gas fee (Relay Fee) for routing.

Inner layer (Payload E2EE): The data itself (for example, JSON with a system prompt) is encrypted with a symmetric key (AES-256-GCM or ChaCha20-Poly1305). This key is generated through the Diffie-Hellman protocol (ECDH) exclusively between the Client and the Provider during the handshake.

Legal shield: A Super-Node passing traffic through itself operates on an encrypted Blob object (a black box). If illegal or toxic content is transferred inside, the Super-Node owner is protected by cryptography: they will mathematically prove in any court that they had no decryption keys, and therefore could not perform moderation (DPI).

## 3.4 Metadata Obfuscation (Protection Against Traffic Analysis)

Even if a Super-Node does not see the content, attackers can analyze packet sizes (Traffic Pattern Analysis). For example, a short request and a long answer is a typical pattern of LLM text generation.
To protect the confidentiality of corporate clients:

Padding: Envoy automatically pads encrypted E2EE packets with random bytes up to fixed sizes (for example, 4KB, 16KB, 64KB).

Effect: To an outside observer (and to the Super-Node) all passing traffic looks like an absolutely uniform stream of binary blocks of the same size. Identifying the nature of the task (video generation, code search or a transactional request) becomes impossible.
