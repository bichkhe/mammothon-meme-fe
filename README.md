# mammothon-meme-fe

## Welcome
Say hello to the newest member of the ever-evolving DeFi landscape: meme.fun, where all launched and tradable coins.

Our platform enable a vibrant, fair, and user-friendly environment for traders and communities.

Please take a look at our documentation: [rustwarriors-docs-meme-fun](https://rustwarriors-docs.gitbook.io/rustwarriors-docs)

Our demo is available at: [memefun.rustwarriors.vn](https://memefun.rustwarriors.vn)

## Technologies

### Setup celestia node
#### Run a light node
First we'll need to install the celestia binary to run our DAS light node.
Use the following command to install a pre-built binary of celestia-node, for the latest release for Mocha testnet:

```bash
bash -c "$(curl -sL https://docs.celestia.org/celestia-node.sh)" -- -v v0.21.5-mocha
```

Initializing your light node will set up configuration files and create a keypair for your node.
The p2p.network flag is used to specify the network you want to connect to. Use mocha for Mocha testnet.

```bash
celestia light init --p2p.network mocha
```

Set trushted hash

```bash
export TRUSTED_HEIGHT=$(curl -s "https://rpc-mocha.pops.one/header" | jq -r '.result.header.height') && export TRUSTED_HASH=$(curl -s "https://rpc-mocha.pops.one/header" | jq -r '.result.header.last_block_id.hash') && echo "Height: $TRUSTED_HEIGHT" && echo "Hash: $TRUSTED_HASH"
```

Start light node

```bash
celestia light start --headers.trusted-hash $TRUSTED_HASH \
    --p2p.network mocha --core.ip rpc-mocha.pops.one --core.port 9090
```

Get node address

```bash
celestia state account-address
```

### Foundrdy
#### What is Foundry?
Foundry is a fast, portable, and modular smart contract development toolkit for Ethereum, written in Rust.
It provides developers with powerful tools to compile, test, deploy, and debug Solidity smart contracts efficiently.
#### Install
On Linux and macOS, you can install Foundry via the following command:

```bash
curl -L https://foundry.paradigm.xyz | bash
```
Then, restart your terminal and run:
```bash
foundryup
```

Install Foundry on Windows
On Windows, you can install Foundry from WSL via the following command:

```bash
iwr -useb https://foundry.paradigm.xyz | iex
```

#### Using Foundry
Create new project:
```bash
forge init my-foundry-project
cd my-foundry-project
```
Compile your contracts:
```bash
forge build
```

Run tests:
```bash
forge test
```

### Next.js
#### What is Next.js?
Next.js is a React-based framework that enables server-side rendering (SSR), static site generation (SSG), API routes, and optimized performance.
It is widely used for building modern web applications, dynamic websites, and SEO-friendly pages.

#### Why Use Next.js?
✅ SEO-Friendly – SSR and SSG help improve page indexing for search engines.<br>
✅ Faster Performance – Pre-renders pages and optimizes assets.<br>
✅ Built-in Routing – Uses a file-based routing system instead of react-router.<br>
✅ Hybrid Rendering – Supports SSR, SSG, ISR, and CSR dynamically.<br>
✅ API Routes – You can build backend APIs inside a Next.js app without using a separate backend server.<br>
✅ Automatic Code Splitting – Loads only the required JavaScript to improve performance.<br>
✅ Built-in Image Optimization – Provides better loading performance for images.<br>


### Convex
Convex is a full-stack reactive backend that provides:<br>
✅ Serverless database – No need to manage servers or database infrastructure.<br>
✅ Automatic reactivity – Frontend updates instantly when data changes.<br>
✅ Built-in functions (serverless API) – Create backend logic with TypeScript/JavaScript functions.<br>
✅ Integrated authentication – Supports Google, GitHub, and other authentication providers.<br>
✅ Scalability & Performance – Optimized for high-performance, real-time applications.<br>

## Economics
### Bonding Curve
#### What is Bonding Curve?
A bonding curve is a mathematical function that defines the relationship between the price and supply of a token.
#### How it works?
A bonding curve automatically determines the price of a token based on its supply.<br>
As more tokens are bought/minted, their price increases according to the curve.<br>
As tokens are sold/burned, their price decreases.<br>
#### Types of Bonding Curve
Linear Bonding Curve.<br>
Exponential Bonding Curve.<br>
Sigmoid Bonding Curve.<br>

### Auto Market Maker
#### What is an Automated Market Maker(AMM)?

An Automated Market Maker (AMM) is a decentralized trading mechanism that removes the need for order books by using liquidity pools and mathematical formulas to determine asset prices.

#### How AMMs Work?
In AMMs, trades are executed against a liquidity pool instead of matching buyers and sellers directly.

#### AMM Liquidity Pools
A liquidity pool is a smart contract that holds two or more tokens to enable trading. Instead of traditional market makers, anyone can deposit tokens into these pools to provide liquidity.

Providing Liquidity:
Users deposit assets (e.g., ETH & USDT) into a pool.<br>
They receive LP tokens representing their share of the pool.<br>
LPs earn trading fees (e.g., 0.3% per trade on Uniswap).<br>
AMM adjusts the price automatically based on supply & demand.<br>

#### AMM Pricing Models (Mathematical Formulas)
1. Constant Product Market Maker (CPMM) – Uniswap Model:

```math
x∗y=k
```
Formula Explanation:
x = Amount of Token A in the pool (e.g., ETH). <br>
y = Amount of Token B in the pool (e.g., USDT). <br>
k = Constant (liquidity must always be balanced). <br>

2. Constant Sum Market Maker (CSMM)

```math
x+y=k
```
Provides a fixed price for swaps (useful for stablecoins).<br>
Issue: Can be exploited via arbitrage since it doesn't adjust prices dynamically.<br>

3. Curve’s StableSwap Algorithm (Optimized for Stablecoins)

```math
A(xy+yx)+(1−A)(x+y)=k
```

Designed for stablecoins (USDT, DAI, USDC). <br>
Keeps prices stable with minimal slippage. <br>

## Incoming Features
### Liquidity Pool
### Group chat
