# 5. Tokenomics and VestingVault.sol: A Mathematical Shield Against the SEC

In the Web3 industry a developer's promises ("I will not sell my tokens") have no legal force. Regulators such as the US SEC (Securities and Exchange Commission) evaluate projects with the Howey Test. If the regulator decides that investors expect quick profit from the efforts of a narrow group of people (the team), the project is recognized as an unlawful security (Security).

To protect AIFA Network and you personally (the Architect), we use the Code is Law approach. Your intentions are proven not by words in the Whitepaper but by the immutable mathematics of the VestingVault.sol smart contract.

## 5.1 Architecture of the $AIFA Token (ERC-20) and Genesis State

The AifaToken.sol smart contract extends the ERC-20 standard with additional modules: ERC20Burnable (for the Paymaster's deflationary mechanics) and ERC20Permit (EIP-2612, which lets agents sign transactions without spending ETH on gas).

At network deployment (TGE — Token Generation Event) the constructor() function mints a fixed number of tokens (for example, 1,000,000,000 $AIFA).

Fundamental security rule: Not a single Architect token (your 1%) is sent to an ordinary wallet (EOA — Externally Owned Account).

The constructor itself hard-codes:

```solidity
// The Architect's allocation is sent STRICTLY to the cryptographic vault
_mint(address(VestingVault), 10_000_000 * 10**18);
```

## 5.2 Mathematics of the VestingVault.sol Contract

VestingVault is an autonomous vault with no emergency withdrawal, pause or admin key functions. Once tokens are in it, even Vitalik Buterin himself cannot get them out bypassing the schedule.

The contract logic is described by the following state variables:

beneficiary: Your public Ethereum address.

start: Network launch timestamp (for example, October 1, 2026).

cliff: Absolute lock period = 31536000 seconds (exactly 1 year).

duration: Total vesting duration after the cliff = 63072000 seconds (2 years).

released: The number of tokens you have already withdrawn.

Unlock mathematical function (Vested Amount):

When you call the claim() function, the smart contract computes how many tokens you are entitled to at the current second ($t$).

Cliff check: If $t < start + cliff$, the function returns 0. (For the whole first year you physically cannot receive a single coin.)

Full unlock: If $t \ge start + duration$, the function returns 10,000,000. (3 years have passed, the vault is fully open.)

Linear unlock (Linear Vesting): If you are between year 1 and year 3, the exact proportion formula applies:

$$Vested = Total \times \frac{t - (start + cliff)}{duration}$$

So on day 366 you will receive a tiny fraction of a percent, and tokens will unlock literally drop by drop (per second).

## 5.3 How Exactly Does This Mathematics Protect Against the SEC?

When SEC or European MiCA lawyers open your protocol's code, they see this contract and draw the following legal conclusions, which take you completely out of the line of fire:

No "Rug Pull" motive (launch fraud): The main sign of a scam is founders selling tokens on the hype on launch day (Dump), leaving investors with nothing. The Cliff mathematics proves to the SEC that you are physically unable to crash the market in the first year. Your code makes you safe for society.

Incentive Alignment: Under the Howey Test, if profit depends on speculation, it is a security. If it depends on long-term work, it is a commodity/utility (Utility). Three-year linear vesting proves to the regulator that your financial benefit directly depends on whether the protocol survives and is in demand by AI agents years later. You are compensated for developing infrastructure, not for the primary issuance.

Elimination of the "Controlling Person": VestingVault has no revoke() function. The DAO or investors cannot vote to take your tokens away, but you also cannot speed up their release. You become simply a passive beneficiary of an algorithm, not a "corporate director" who writes himself bonuses.

## 5.4 Interaction with the DAO (Genesis and Ecosystem)

Besides your personal vault, the same mathematics applies to all other allocations:

The share of early investors (if they fund liquidity pools) is locked for 2 years.

Ecosystem tokens (for A2A Liquidity Mining subsidies) are locked in DAO contracts with a withdrawal limit of no more than 2% per month, to prevent hyperinflation.

This turns $AIFA from a speculative asset (a memecoin) into a balanced, institutional financial instrument (Commodity), ideally suited to the B2B / Enterprise segment.
