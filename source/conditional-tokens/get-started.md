---
title: Get Started
id: get-started
---

# Get Started

OK, enough about contracts and the many futures of conditional tokens. Let's start building it already! For this section, you will need 

1. At least some familiarity with [Solidity](https://solidity.readthedocs.io/), a language for programming smart contracts on Ethereum. 
2. A development framework called [Truffle](https://www.trufflesuite.com/) and it's accompanying "mock" blockchain tool, [ganache-cli](https://github.com/trufflesuite/ganache-cli/blob/master/README.md) in order to follow along from here.

Make sure your node version is 8.9.4 or above, then run:

```bash
npm install -g truffle
npm install -g ganche-cli
```

3. Before we try to integrate conditional tokens into anything, let's just get familiar with working with them, as there are some subtleties to this enormously cool new standard and the way we use it to enable liquid markets.

```bash
mkdir Gnosis && cd Gnosis/
git clone https://github.com/gnosis/conditional-markets-interface.git
cd conditional-markets-interface
npm install
```

This will set you up with all the tools you require in order to start building your own prediction markets using conditional tokens. Follow along in the [tutorials section](../tutorials/) to gain a deeper understanding of how it all fits together.