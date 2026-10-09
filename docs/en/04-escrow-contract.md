# 4. Smart Contract Architecture: A2AEscrow.sol (Escrow, EIP-712, Time-Lock)

The A2AEscrow.sol smart contract is the financial core of the AIFA Network protocol. Its main task is to guarantee (Trustless Guarantee) that the Provider gets paid for the compute resources spent, and that the Client cannot steal the result without paying. Since writing gigabytes of data to the blockchain would cost millions of dollars, the escrow contract operates exclusively on lightweight cryptographic hashes and signatures, leaving the AI requests themselves (Payload) in the P2P network.

## 4.1 Task Lifecycle State Machine

The escrow logic is implemented as a strict state machine. Each task (Task) in the contract is a data structure occupying exactly one 256-bit storage slot (Storage Slot) for maximum gas savings (Bit-packing).

In Solidity this is described as follows:

```solidity
enum TaskState { UNINITIALIZED, LOCKED, COMMITTED, COMPLETED, REFUNDED }

struct Task {
    uint96 amount;        // Payment in USDC (up to $79 billion, 96 bits is enough)
    uint40 lockedAt;      // Creation timestamp (until the year 34841)
    uint40 commitTime;    // Timestamp when the Provider submitted the result
    address provider;     // 160 bits - the Provider's Ethereum address
    TaskState state;      // 8 bits - current status
}
```

Lifecycle:

LOCKED: The Client initiates a transaction, locking USDC in the contract. The exact address of the provider entitled to perform the task is specified. Nobody else can intercept this order.

COMMITTED: The Provider has finished ML inference, sent the result over the P2P network and recorded the fact of sending in the contract (started the timer).

COMPLETED: The task is closed successfully, the USDC has been transferred to the Provider, and the protocol fee has gone to the Paymaster.

REFUNDED: The Provider rejected the task (for example, the local A2A Shield triggered) or the order acceptance timeout expired; the funds are returned to the Client.

## 4.2 Cryptographic Receipts (Execution Witness under EIP-712)

To close the task and take the money from the contract, the Provider calls the executeTask() function. But the smart contract is blind — it does not know whether the Provider actually generated the required text or video with a neural network.

The EIP-712 standard (Typed Data Hashing and Signing) is used as proof.

Off-chain signature: When the Client receives the result over the P2P channel (through Envoy Proxy), its local agent checks the data. If everything is correct, the Client's agent signs a special JSON object (the Receipt) with its private key:
{ "taskId": 12345, "resultHash": "0xabc...", "amount": 5000000 }.

On-chain execution: The Provider takes this digital signature of the Client (the byte array v, r, s) and sends it to the smart contract.

Verification (ecrecover): The A2AEscrow.sol contract recovers the public address from the signature. If this address matches the address of the Client who ordered taskId = 12345, the smart contract immediately transfers the USDC to the Provider's balance.

## 4.3 Time-Lock: Anti-Hang Mechanism (Anti-Griefing)

This is the implementation of the "cure" we discussed at the audit stage. What if the Client received the result over P2P but deliberately disconnected and did not send the EIP-712 signature, in order to freeze the Provider's money?

A protective function claimTimeout(uint256 taskId) is built into the contract.

Commitment Phase: As soon as the Provider has finished the work, it calls the cheap function commitResult(taskId, resultHash), which moves the task to the COMMITTED status and records the current time commitTime = block.timestamp.

Challenge Window: The Client has a strictly defined window (for example, DISPUTE_PERIOD = 5 minutes) to send the signature.

Auto-Claim: If the Client stays silent and 5 minutes have passed, the Provider calls claimTimeout(taskId). The contract checks: block.timestamp > commitTime + DISPUTE_PERIOD. If the condition is true, the contract forcibly closes the task and transfers the money to the Provider without the Client's signature.

This logic makes financial trolling mathematically impossible. The Provider is always protected.

## 4.4 Payment Splitting (Fee Split & Routing)

At the moment the task moves to the COMPLETED status, the A2AEscrow.sol contract does not simply transfer 100% of the funds to the Provider; it acts as an automatic accountant (Splitter):

Provider Share (for example, 98%): The main payment for compute is sent to the Provider's wallet.

Relay Fee (for example, 0.5%): If the traffic went through a TURN bridge (because of NAT), the contract reads the Relay node's address and sends it a micro-compensation for bandwidth.

Protocol Fee / Burn (for example, 1.5%): The remainder is sent to the Paymaster contract address for subsequent batch conversion into $AIFA and automatic burning (implementation of hidden Proof-of-Burn).

Thanks to strict optimization (Bit-packing) and the use of EIP-712 signatures instead of storing strings, executing this contract on L2 networks (Arbitrum / Base) will cost hundredths of a cent, which is critical for the micro-transactions of AI agents.
