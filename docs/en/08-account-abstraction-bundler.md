# 8. Account Abstraction (ERC-4337): The UserOperation Structure and Bundler Infrastructure

Autonomous AI agents should not manage native blockchain wallets (EOA), having to calculate gas by hand, watch their ETH/MATIC balance and sign raw base transactions. In AIFA Network v6.0 we implement an Account Abstraction stack based on the ERC-4337 standard, which turns every AI agent wallet into a programmable smart account (Smart Contract Wallet).

This fully isolates the agent's application logic from blockchain mechanics: the agent operates on a "request-payment" abstraction in USDC, and all the work with network fees is taken over by special aggregator nodes (Bundlers) and the Paymaster contract.

## 8.1 Anatomy of the UserOperation Structure

Instead of standard Ethereum transactions, AI agents form pseudo-transactions — UserOperation (UserOp) objects. The structure packs the agent's intent and is passed over the P2P network of Bundler nodes outside the blockchain's main mempool.

```solidity
struct UserOperation {
    address sender;             // Address of the AI agent's smart account
    uint256 nonce;              // Unique sequential number (Anti-Replay)
    bytes initCode;             // Smart account creation code (if launched for the first time)
    bytes callData;             // Encoded function call (for example, lockFunds in A2AEscrow)
    uint256 callGasLimit;       // Gas limit for executing the application logic
    uint256 verificationGasLimit; // Gas limit for checking signatures and the Paymaster
    uint256 preVerificationGas; // Gas limit to compensate the Bundler's overhead
    uint256 maxFeePerGas;       // Maximum gas price (EIP-1559)
    uint256 maxPriorityFeePerGas;// Tip to the blockchain miner/validator
    bytes paymasterAndData;     // Paymaster contract address + sponsorship signature/conditions
    bytes signature;            // The AI agent's cryptographic signature (secp256k1 / BLS / Passkey)
}
```

Key fields for M2M interaction:

initCode (Lazy Account Deployment): An AI agent is created instantly without transactions on the blockchain. Its smart account is generated off-chain deterministically through CREATE2. The first transaction automatically deploys the account contract thanks to the initCode field.

paymasterAndData: The main integration flag. Contains the address of AifaPaymaster.sol and parameters indicating that the gas for the transaction is paid not by the agent but by the Paymaster, which deducts the equivalent in USDC.

## 8.2 Bundler Infrastructure: Assembling and Packing Meta-Transactions

A Bundler is a specialized infrastructure node (it can be run by Super-Node operators) that listens to a separate Alt-Mempool for UserOperations.

```
[Client Agent] ---> (UserOp in USDC) ---> [Alt-Mempool (P2P)]
                                                 │
                                                 ▼
                                        [ Bundler Node ]
                                                 │
                             (Packing into a bundle: [UserOp1, UserOp2, ...])
                                                 │
                                                 ▼
                                   [ EntryPoint.sol (On-Chain) ]
                                                 │
                                    ┌────────────┴────────────┐
                                    ▼                         ▼
                          [AifaPaymaster.sol]       [A2AEscrow.sol]
                         (USDC charged for gas)     (Escrow capture)
```

Step-by-step Bundler algorithm:

Reception and filtering (Validation Phase): The Bundler receives a UserOp through the JSON-RPC method eth_sendUserOperation. It performs an off-chain simulation through the EntryPoint.sol contract, checking:
- The validity of the UserOp.signature.
- That AifaPaymaster or the agent has a sufficient USDC balance/approval.
- The absence of forbidden opcodes (for example, TIMESTAMP, GASPRICE) that could break execution determinism.

Aggregation (Batching): The Bundler combines 10 to 100 valid UserOps from different AI agents into one standard Ethereum transaction.

Submission to the On-Chain EntryPoint: The Bundler calls the function handleOps(UserOperation[] ops, address beneficiary) on the singleton EntryPoint.sol contract.

Gas compensation: The Bundler pays the native L2 network gas (ETH/Base/Arbitrum) from its own wallet, and the EntryPoint contract instantly compensates its costs from the AifaPaymaster.sol deposit + accrues a micro-premium (Bundler Fee).

## 8.3 The EntryPoint.sol Contract: The Execution Core

The ERC-4337 standard uses a single EntryPoint contract, proven over the years and deployed at the same addresses in all EVM networks. It acts as a trusted orchestrator.

Lifecycle of a handleOps() call inside EntryPoint:

Verification Loop:
- For each UserOp, the sender account is checked.
- If the account has not been created yet, initCode is executed.
- The validateUserOp() function on the agent's smart account is called to check the ECDSA signature.
- validatePaymasterUserOp() is called on the AifaPaymaster.sol contract to lock the required amount of USDC to cover gas.

Execution Loop:
- EntryPoint executes the callData of each UserOp (for example, sending a call to A2AEscrow.sol).
- The exact amount of gas actually spent is measured.
- EntryPoint deducts from the Paymaster deposit exactly as much USDC (plus the Bundler premium) as was needed for gas, and returns the unused remainder.

## 8.4 Benefits for the AIFA Network Ecosystem

Zero friction (Zero Gas Friction): An AI agent developer only needs to put $10$ USDC on the smart account. The agent will never again need to hold native ETH for transactions.

Session Keys: The agent's smart account makes it possible to limit permissions. A bot can be given a temporary key allowed to spend no more than $1$ USDC per hour and to call exclusively the A2AEscrow.sol contract. If the bot is hacked, the hacker cannot withdraw all the funds from the account.

Atomic Multi-Operations: An agent can do approve(USDC) and lockFunds() in one UserOp, reducing the number of on-chain steps and saving 40% on gas.
