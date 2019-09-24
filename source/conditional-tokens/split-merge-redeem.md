---
id: split-merge-redeem
title: Split, Merge, and Redeem Positions
---

# Split, Merge, and Redeem Positions

It should be clear from the previous section that, by constructing conditions and outcome collections clearly, we can define _positions_ in prediction markets. These nested and interconnected positions are what we are talking about when we say that every one of the millions of future tokens ought to have a market associated with it that can genuinely survive due to its access to a global liquidity pool. 

![DAG](../img/all-positions-from-two-conditions.png)

## Split

Staking collateral in the contract directly to take a shallow position, or burning stake in a shallow position to take a deeper position are both referred to as _splitting a position_. This is handled the following function:
```solidity
 function splitPosition(IERC20 collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint[] calldata partition, uint amount)
 external
```
If splitting from the collateral, the function will attempt to transfer _amount_ collateral from the message sender to itself. Otherwise, it will burn _amount_ stake held by the message sender in the position being split. Regardless, if successful, _amount_ stake will be minted in the split target positions. If any of the transfers, mints, or burns fail, the transaction will revert. The transaction will also revert if the given partition is trivial, invalid, or refers to more slots than the condition is prepared with.

To decipher this function, let’s consider what would be considered a valid split, and what would be invalid:

![Valid vs Invalid Positions](../img/valid-vs-invalid-splits.png)

## Basic Splits

Collateral `$` can be split into outcome tokens in positions `$:(A)`, `$:(B)`, and `$:(C)`. To do so, use the following code:

```js
    const amount = 1e18 // could be any amount

    // user must allow conditionalTokens to
    // spend amount of DollaCoin, e.g. through
    // await dollaCoin.approve(conditionalTokens.address, amount)

    await conditionalTokens.splitPosition(
        // This is just DollaCoin's address
        '0xD011ad011ad011AD011ad011Ad011Ad011Ad011A',
        // For splitting from collateral, pass bytes32(0)
        '0x00',
        // conditionId from the previous section
        '0x67eb23e8932765c1d7a094838c928476df8c50d1d3898f278ef1fb2a62afab63',
        // Each element of this partition is an index set:
        // see Outcome Collections for explanation
        [0b001, 0b010, 0b100],
        // Amount of collateral token to submit for holding
        // in exchange for minting the same amount of
        // outcome token in each of the target positions
        amount,
    )
```
The effect of this transaction is to transfer `amount` DollaCoin from the message sender to the `conditionalTokens` to hold, and to mint `amount` of outcome token for the following positions:

| Symbol   |                            Position ID                       |
| -------  |                              ---------                       |
| $:(A) | 0x8c12fa3bb72c9c455acd4d6034989ec0ce9188afd7c89c8c42d064ed7fe5a9d8 |
| $:(B) | 0x21aec03d8dfd8b5f0a2750718fe491e439f3625816e383b66a05cabd56624b4c |
| $:(C) | 0x8085f7c500098412ff2fc701a74174527e7b39a2b923cd0bca6ad2d5f7fa348d |

Outcome tokens are not EIP-20 tokens, but EIP-1155 multi tokens, allowing for batch transfers and other useful, gas-saving functionality explained below.

Importantly, the set of `(A)`, `(B)`, and `(C)` is not the only nontrivial partition of outcome slots for the example categorical condition. For example, the set `(B)` (with index set `0b010`) and `(A|C)` (with index set `0b101`) also partitions these outcome slots, and consequently, splitting from `$` to `$:(B)` and `$:(A|C)` is also valid and can be done with the following code:

```js

    await conditionalTokens.splitPosition(
        '0xD011ad011ad011AD011ad011Ad011Ad011Ad011A',
        '0x00',
        '0x67eb23e8932765c1d7a094838c928476df8c50d1d3898f278ef1fb2a62afab63',
        // This partition differs from the previous example
        [0b010, 0b101],
        amount,
    )
```
This transaction also transfers `amount` DollaCoin from the message sender to the `conditionalTokens.sol` to hold, and it mints `amount` of EIP-1155 outcome token for the following positions:

| Symbol   |                            Position ID                       |
| -------  |                              ---------                       |
| $:(B)  | 0x21aec03d8dfd8b5f0a2750718fe491e439f3625816e383b66a05cabd56624b4c |
| $:(A or C) | 0xb33b3d0035913315b76e85842f682920f78b32c43c7175768c4c67e3f31e6413 |

If non-disjoint index sets are supplied to `splitPosition`, the transaction will revert. Partitions must be valid. For example, you can't split `$` to `$:(A|B)` and `$:(B|C)` because `(A|B)` (`0b011`) and `(B|C)` (`0b110`) share outcome slot `B` (`0b010`).

## Splits to Deeper Positions

Splitting a shallow position means burning outcome tokens in that position in order to acquire outcome tokens in deeper positions. For example, you can split `$:(A|B)` to target `$:(A|B)&(LO)` and `$:(A|B)&(HI)`:
```js
    await conditionalTokens.splitPosition(
        // Note that we're still supplying the same collateral token
        // even though we're going two levels deep.
        '0xD011ad011ad011AD011ad011Ad011Ad011Ad011A',
        // Here, instead of just supplying 32 zero bytes, we supply
        // the collection ID for (A|B).
        // This is NOT the position ID for $:(A|B)!
        '0x52ff54f0f5616e34a2d4f56fb68ab4cc636bf0d92111de74d1ec99040a8da118',
        // This is the condition ID for the example scalar condition
        '0x3bdb7de3d0860745c0cac9c1dcc8e0d9cb7d33e6a899c2c298343ccedf1d66cf',
        // This is the only partition that makes sense
        // for conditions with only two outcome slots
        [0b01, 0b10],
        amount,
    )
```
This transaction burns `amount` of outcome token in position `$:(A|B)` (positionId `0x6147e75d1048cea497aeee64d1a4777e286764ded497e545e88efc165c9fc4f0`) in order to mint `amount` of outcome token in the following positions:

| Symbol   |                            Position ID                       |
| -------  |                              ---------                       |
|$:(A or B)&(LO) | 0xcc77e750b61d29e158aa3193faa3673b2686ba9f6a16f51b5cdbea2a4f694be0 |
|$:(A or B)&(HI) | 0xbacf3ddf0474d567cd254ea0674fe52ab20a3e2ebca00ec71a846f3c48c5de9d |

## Splits on Partial Partitions

Supplying a partition which does not cover the set of all outcome slots for a condition, but rather a specific outcome collection, is also possible. For example, it is possible to split `$:(B|C)` (positionId `0x5d06cd85e2ff915efab0e7881432b1c93b3e543c5538d952591197b3893f5ce3`) to `$:(B)` and `$:(C)`:

```js
    await conditionalTokens.splitPosition(
        '0xD011ad011ad011AD011ad011Ad011Ad011Ad011A',
        // Note that we also supply zeroes here, as the only aspect shared
        // between $:(B|C), $:(B) and $:(C) is the collateral token
        '0x00',
        '0x67eb23e8932765c1d7a094838c928476df8c50d1d3898f278ef1fb2a62afab63',
        // This partition does not cover the first outcome slot
        [0b010, 0b100],
        amount,
    )
```

## Merging Positions

Merging positions does precisely the opposite of splitting a position. It burns outcome tokens in the deeper positions to either mint outcome tokens in a shallower position, or send collateral to the message sender. You can see below that merging is the same as splitting, except in reverse:

![Merging Positions](../img/merge-positions.png)

To merge positions, use the following function:

```solidity
function mergePositions(IERC20 collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint[] calldata partition, uint amount) external
```

## Querying and Transferring Stake

Because outcome tokens are EIP-1155 multi token, each one is indexed by an ID. In particular, positionIds are used to index outcome tokens. This is reflected in the balance querying function:

```solidity
balanceOf(address owner, uint256 positionId) external view returns (uint256)
```
To transfer outcome tokens, the following functions may be used, as per EIP-1155. These have been [shown to save on gast costs](https://github.com/ethereum/EIPs/issues/1155#issuecomment-399969060), and allow you to move many tokens at once, which makes settling positions once the oracle has submitted a payout vector a much more straightforward affair.
```solidity
safeTransferFrom(address from, address to, uint256 positionId, uint256 value, bytes data) external
safeBatchTransferFrom(address from, address to, uint256[] positionIds, uint256[] values, bytes data) external
safeMulticastTransferFrom(address[] from, address[] to, uint256[] positionIds, uint256[] values, bytes data) external
```

## Redeeming Positions

Before this is possible, the payout vector must be set by the oracle:

```solidity
function reportPayouts(bytes32 questionId, uint[] calldata payouts) external
```
This will emit the following event:

```solidity
event ConditionResolution(bytes32 indexed conditionId, address indexed oracle, bytes32 indexed questionId, uint outcomeSlotCount, uint[] payoutNumerators)
```
Then positions containing this condition can be redeemed via:

```solidity
function redeemPositions(IERC20 collateralToken, bytes32 parentCollectionId, bytes32 conditionId, uint[] calldata indexSets) external
```
This will trigger the following event:

```solidity
event PayoutRedemption(address indexed redeemer, IERC20 indexed collateralToken, bytes32 indexed parentCollectionId, bytes32 conditionId, uint[] indexSets, uint payout)
```
Take a look at this chart to get a more visual understanding of the flow:

![Redemption Process](../img/redemption.png)

