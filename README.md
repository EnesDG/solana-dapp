# Solana for Beginners

## Step 1

Install Solana: https://docs.solana.com/cli/install-solana-cli-tools

```shell
git clone git@github.com:dankelleher/solana-for-beginners.git
```

### Wallet

Phantom
Sollet (dev only)

```shell
solana-keygen new
```

### Transfer

```shell
solana airdrop 1
solana transfer <wallet> 0.5
```

https://explorer.solana.com/

### SPL-Token

```shell
spl-token create-token
spl-token create-account <TOKEN>
spl-token mint <TOKEN> 1000
```

### Accounts

- Standard (system-program-owned) Accounts vs Program-Derived Address Accounts (PDAs)
- Associated Token Accounts (ATAs)
- "On and off the curve"

### dApp Development

```shell
yarn
yarn start
```
