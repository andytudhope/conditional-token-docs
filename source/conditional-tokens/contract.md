---
id: contract
title: Contract Overview
---

# Conditional Token Overview

In order to understand [conditional tokens](https://github.com/gnosis/conditional-tokens-contracts/blob/master/contracts/ConditionalTokens.sol), you need to grasp how they are used to construct _positions_. A _position_ is a financial term which basically means a bet, i.e. someone putting their money where their mouth is. Positions are fundamental to how free markets work, but there is a problem. Many so-called "positions" which can be taken in the current financial system are only available to select groups of rich individuals, corporations and government bodies. The market is never _really_ free or fair, but we can help change that through altering the very notion of what a position is, as well as who can access it.

However, before we can talk about positions, we first have to talk about

1. Conditions, and
2. Outcome collections

## Conditions

Before conditional tokens can exist, a condition must be prepared. A condition is a question to be answered in the future by a specific oracle in a particular manner. The following function is used to prepare a condition, which will be decided when the oracle submits what we call a "payout vector":

```solidity
function prepareCondition(address oracle, bytes32 questionId, uint payoutDenominator, uint outcomeSlotCount) external
```

1. _oracle_ – The account assigned to report the result for the prepared condition.
2. _questionId_ – An identifier for the question to be answered by the oracle.
3. _payoutDenominator_ – What the payouts reported by the oracle must eventually sum up to. This used to be 1, but having a variable allows for more flexibility.
4. _outcomeSlotCount_ – The number of outcome slots which should be used for this condition. Must not exceed 256.

> You, the consumer of the contract, have to interpret the question ID correctly. For example, it could be an IPFS hash which can be used to retrieve a document specifying the question more fully. Agreeing upon the mechanism for creating questionIds is left up to clients.

## Simple Example

Say we have a question where only one out of multiple choices may be chosen:

> Who out of the following will be chosen? [Alice, Bob, Carol]

Through some commonly agreed upon mechanism, the detailed description for this question becomes a 32 byte questionId: `0xabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc1234`

Let’s also suppose we trust the oracle with address `0x1337aBcdef1337abCdEf1337ABcDeF1337AbcDeF` to deliver the answer for this question, and that the payoutDenominator should sum to 1 for simplicty.

To prepare this condition, the following code gets run:
```js
await conditionalTokens.prepareCondition(
    '0x1337aBcdef1337abCdEf1337ABcDeF1337AbcDeF',
    '0xabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc1234',
    1,
    3
)
```
Later, if the oracle makes a report that the payout vector for the condition is `[0, 1, 0]`, it is stating that Bob was chosen, as the outcome slot associated with Bob would receive all of the payout.

## Outcome Collections

An outcome collection is defined as a **nonempty proper subset of a condition’s outcome slots which represents the sum total of all the contained slots payout values**. Basically, in the above question about who was chosen, we might have thought that a collection of outcomes like "Alice or Bob", denoted `(A|B)`, was the most likely, so we need to be able to represent that. Outcome collections are how we do so. 

Tthe payout vector which the oracle reports will contain a `1` in exactly one of the three slots, so the sum of the values in Alice’s and Bob’s slots is one precisely when either Alice or Bob is chosen, and zero otherwise.

`(C)` by itself is also a valid outcome collection, but `()` is an invalid outcome collection, as it is empty. Empty outcome collections represent no eventuality and have no value no matter what happens. `(A|B|C)` is also an invalid outcome collection, as it is not a proper subset. Outcome slots from different conditions (e.g. `(A|X)`) cannot be composed in a single outcome collection.

An outcome collection may be represented by a **condition** and an **index set**. This is a 256 bit array which denotes which outcome slots are present in a outcome collection. For example, the value `3 == 0b011` corresponds to the outcome collection `(A|B)`, whereas the value `4 == 0b100` corresponds to `(C)`. Note that the indices start at the lowest bit in a `uint`.

An outcome collection can be identified with a 32 byte value called a collectionId. In order to calculate the collectionId for `(A|B)`, we hash the conditionId and the index set:
```js
web3.utils.soliditySha3({
    // Some previously calculated conditionId
    t: 'bytes32',
    v: '0x67eb23e8932765c1d7a094838c928476df8c50d1d3898f278ef1fb2a62afab63'
}, {
    t: 'uint',
    v: 0b011 // Binary Number literals supported in newer versions of JavaScript
})
```
This results in a collectionId of `0x52ff54f0f5616e34a2d4f56fb68ab4cc636bf0d92111de74d1ec99040a8da118`.

While outcome slots from different conditions cannot be composed, we can combine the collectionIds of outcome collections for different conditions by adding their values and then taking the lowest 256 bits. To illustrate this, another example!

## Scalar Example

Let's ask a question whose answer may lie in a range:

>What will the score be? [0, 1000]

Assume the questionId is `0x777def777def777def777def777def777def777def777def777def777def7890`, and that we trust the oracle `0xCafEBAbECAFEbAbEcaFEbabECAfebAbEcAFEBaBe` to deliver the results for this question.

To prepare this condition, the following code gets run:
```js
await conditionalTokens.prepareCondition(
    '0xCafEBAbECAFEbAbEcaFEbabECAfebAbEcAFEBaBe',
    '0x777def777def777def777def777def777def777def777def777def777def7890',
    1,
    2
)
```
This results in a collectionId of `0x52ff54f0f5616e34a2d4f56fb68ab4cc636bf0d92111de74d1ec99040a8da118`.

We prepare the condition with two slots: one which represents the low end of the range (0) and another which represents the high end (1000). The payout vector should indicate how close the answer was to these endpoints. For example, if the oracle makes a report that the payout vector is `[0.9, 0.1]`, then this means the score was 100 (the slot corresponding to the low end is worth nine times what the slot corresponding with the high end is worth, meaning the score should be nine times closer to 0 than it is close to 1000). Likewise, if the payout vector is reported to be `[0, 1]`, then the oracle is saying that the score was _at least_ 1000.

Now, let’s denote the enpoints 0 and 1000 as **LO** and **HI** respectively. Using the same method as above, we can find the collectionId for `(LO)` to be `0xd79c1d3f71f6c9d998353ba2a848e596f0c6c1a9f6fa633f2c9ec65aaa097cdc`.

Finally, we can find the combined collectionId for the two different conditions from both our questions in an expression like `(A|B)&(LO)`:
```js
'0x' + BigInt.asUintN(256,
    0x52ff54f0f5616e34a2d4f56fb68ab4cc636bf0d92111de74d1ec99040a8da118n +
    0xd79c1d3f71f6c9d998353ba2a848e596f0c6c1a9f6fa633f2c9ec65aaa097cdcn
).toString(16)
```
This yields the value `0x2a9b72306758380e3b0a31125ed39a635432b283180c41b3fe8b5f5eb4971df4`.

## Defining Positions

In order to define a position, we first need to designate a collateral token. This token must be an ERC20 token which exists on the same chain as the _ConditionalTokens.sol_ instance.

Then we need at least one condition with an outcome collection, though a position may refer to multiple conditions each with an associated outcome collection. Positions become valuable when all of the constituent outcome collections are valuable. More explicitly, the value of a position is a product of the values of those outcome collections composing the position.

Forget the code for a moment and focus on this **critical point**: a position is now a clearly defined mathematical construct on a public and decentralised network. Anybody can create a condition, and anybody can take a position on that condition. It may seem a little abstract now, but this construct allows as many markets to exist as there are tokens, and for each of those markets to benefit from a global pool of liquidity.

Back into the weeds: position identifiers can also be calculated by hashing the address of the collateral token and the combined collectionIds of all the outcome collections in the position. We say positions are _deeper_ if they contain more conditions and outcome collections, and _shallower_ if they contain less.

## Positions Example

Let’s suppose that there is an ERC20 token called DollaCoin which exists at the address `0xD011ad011ad011AD011ad011Ad011Ad011Ad011A`, and it is used as collateral for some positions. We will denote this token with `$`. We can calculate the positionId for the position `$:(A|B)` via:
```js
web3.utils.soliditySha3({
    t: 'address',
    v: '0xD011ad011ad011AD011ad011Ad011Ad011Ad011A'
}, {
    t: 'bytes32',
    v: '0x52ff54f0f5616e34a2d4f56fb68ab4cc636bf0d92111de74d1ec99040a8da118'
})
```
Which returns `0x6147e75d1048cea497aeee64d1a4777e286764ded497e545e88efc165c9fc4f0`.

Similarly, `$:(LO)` is `0xfdad82d898904026ae6c01a5800c0a8ee9ada7e7862f9bb6428b6f81e06f53bb`, and `$:(A|B)&(LO)` has an postionId of `0xcc77e750b61d29e158aa3193faa3673b2686ba9f6a16f51b5cdbea2a4f694be0`.

The important point to grasp here is that DollaCoin may be staked in the contract as collateral in order to take a position in either of our two examples, or indeed, both. In other words, there are _shallow_ positions like `$:(LO)`, or _deep_ positions like `$:(A|B)&(LO)`. Stake in shallow positions can only be obtained through locking collateral directly in the contract; stake in deeper positions may be accessed by burning stake in shallower positions. The resulting nested and interconnected positions are what we are talking about when we say that every one of the millions of future tokens ought to have a market associated with it that can genuinely survive due to its access to a global liquidity pool.

It's easiest to see this at work if we draw out a DAG (directed acyclic graph), which shows all positions backed by `$` that are contingent on either or both of our example conditions:

![DAG](../img/all-positions-from-two-conditions.png)