---
title: Introduction
id: index
---

# Understanding Conditional Tokens

Conditional tokens allow you to:

1. **Make simple** markets on the likelihood of a given event.
2. **Make complex** markets about how the likelihood of an event is affected by any other event. For example, how is the probability of a global recession affected by a trade war between the United States and China over the next year?
3. **Trade** any asset under the condition that a specific event happens. For example, you can buy a tokenized equivalent of the British Pound but only under the condition that no hard Brexit happens. For market observers, these markets will surface asset prices in different possible futures.

Previously such instruments could only be created at a high cost by financial institutions. The arrival of conditional tokens on Ethereum brings down the costs to a few cents and give access to everyone. All conditional tokens can be globally accessible, and payouts are securely (and cheaply) executed through smart contracts.

## Advantages

It's worth noting, first, that the Multi Token Standard brings with it many advantages, though these may differ between [use cases](https://medium.com/sandbox-game/erc-1155-a-new-standard-for-the-sandbox-c95ee1e45072). Batch sends, for instance, decrease substantially the gas costs for users, and so are ideal in gaming environments, with many different types of tokens and high-velocity economies. Another huge advantage, quoted directly from that link:

> We helped fine tune the standard with a special focus on ERC-721 compatibility. This feature is important for us, as we want our creators to be able to create both NFTs (via ERC-721) which can work with the existing ecosystem, and fungible tokens (via ERC-1155) which offer them the ability to mint a collection of items they can sell for use in various gaming experiences.

Using EIP-1155 to make _conditional tokens_, though, has allowed Gnosis to pursue further 3 long-term goals of our own:

1. **Counter low liquidity** with [DutchX](https://www.reddit.com/r/ethereum/comments/a3expm/slowtrade_is_live_on_mainnet_or_why_we_build_the/). With the potential to create millions of distinct markets, individual market liquidity is likely to be low, but using conditional tokens based on EIP-1155 means we can still find a reliable price, as trading on a fully decentralized exchange will unlock a shared global liquidity pool.
2. **Interconnected price dynamics** with [dFusion](https://github.com/gnosis/dex-research). Take (1) the price of an asset, (2) the price of said asset in future A, (3) the price of said asset in future B, and finally (4) the likelihood of futures A and B. While each of these could have an individual market, with an individual price, the prices themselves are not independent. In other words, any 3 of those 4 prices dictates the 4th price. Conditional tokens allos us to feed such information back into the market to make the mechanism itself more efficient.
3. **No dominant currency**. In the future, many conventional asset classes will be tokenized, and these tokens will be used as collateral/currency in markets that previously only supported a single currency. Think of markets trading on geopolitical events using a basket of stocks as collateral. An efficient market mechanism will be able to bundle that liquidity while minimizing the cost paid to arbitrageurs.