---
title: Get Started
id: get-started
---

# Get Started

OK, enough about contracts and our multi token future. Let's start building it already! For this section, you will need 

1. At least some familiarity with [Solidity](https://solidity.readthedocs.io/), a language for programming smart contracts on Ethereum. 
2. A development framework called [Truffle](https://www.trufflesuite.com/) in order to follow along from here.

Make sure your node version is 8.9.4 or above, then run:

```bash
npm install -g truffle
```

3. Before we try and integrate conditional tokens into anything, let's just get familiar with working with them, as there are some subtleties to this enormously cool new standard and the way we use it to enable liquid prediction markets.

```bash
mkdir Gnosis && cd Gnosis/
git clone https://github.com/gnosis/conditional-tokens-contracts.git
cd conditional-tokens-contracts
npm i
```