---
id: technical_documentation
title: Overview
---

# Overview

We foresee a tokenized future — where no single currency is dominant and new tradable asset classes take on increasing informational complexity. Conditional tokens, that enable prediction markets, are one of these new asset classes.

**[ERC-1155](./eip-1155.html) is a new standard that allows for the creation of multiple types of tokens in the same contract. Rather than deploying a new contract for each ERC-20 or ERC-721 token you need for your application, you can manage them all from one, logical place. The advantages of this are many: gas savings, batch transfers, lower complexity, deep and meaningful interoperability.**

ERC-1155 tokens are intended for a host of applications which require multiple types of tokens: from games with many different kinds of in-game assets, rewards and incentives, to prediction markets, the most advanced of which require many different kinds of _conditional tokens_ in order to function effectively.

This documentation will teach you what the conditional tokens standard is; discuss various ways in which it can be used to improve your decentralized application (dapp); show you how to encode conditionality so that you can plug into and create liquid prediction markets of your own; provide you with some basic tutorials for getting started with this standard and its many use cases; and connect you to the community of developers working with it.

## Gnosis

In the coming world of multiple tokens and long tail currencies, we at Gnosis feel that there are three key parts to any platform attempting to be permissionless, transparent, fair and safe. Anyone MUST be able to:

1. **Create** conditional tokens, a new asset class with richer informational capabilities that makes the outcome of any future event tradable.
2. **Trade** those assets (and others) using fully decentralized market mechanisms (see [DutchX](https://blog.gnosis.pm/the-dutchx-pilot-d8f3e2007ae4) and [DEX research](https://github.com/gnosis/dex-research) for more).
3. **Hold** those (and other) assets in the [Gnosis Safe](https://safe.gnosis.io), the best way to store conditional and other ERC20 tokens and interact with the decentralized web.

While all of these are designed to work well together, each piece is permissionless and standalone. We hope they will become building blocks in platforms and applications that we have not yet imagined.

  