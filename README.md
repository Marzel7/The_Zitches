### Decentralised exchange using automated maker markets

This branch builds a simple decentralised exchange, utilising an automated maker market token-par (ERC20 BALLOONS) and ETH.

Automated market makers embrace various decentralised algorithms. At the core of this AMM is the constant product function -

### formula

The formula states that k remains constant no matter what reserves (x and y) are. Every trade increases a reserve of either ether or token and decreases a reserve of either token or ether

`(x+Δx)(y−Δy)=xy`

Where Δx is the number of ethers or tokens we’re trading for Δy, number of tokens or ethers we’re getting in exchange. Having this formula, we can now find Δy:

`Δy= x+Δx / yΔx`
​

---

### install

```bash
git clone https://github.com/kkeaveney/The_Zitches.git dex
cd dex
git checkout dex
yarn install
```

### Environment

```

This branch consists of tests, ERC20 and DEX smart contracts.

`hh compile` compile ERC20, DEX contracts.

`hh run tests` (hardhat backend)

`Balloons.sol` is just an example ERC20 contract that mints 1000 to whatever address deploys it.

`DEX.sol` Tracks a token (ERC20 interface) that is set in the constructor (on deployment).



```

### Tests

`01-DEX.test.js`

We call the approve function on the ERC20 token to allow the exchange to spend our tokens.

We can see that the DEX starts empty. Calling init() loads our contract up with 500 ETH and 500 Balloons. At this point, the ETH/BAL pool has a 1:1 ratio. Once liquidity has been deposited init() can only be called again if all liquidity has been removed.

Eth is exchange for tokens by calling ethToToken(). Despite the 1:1 balance of the pool, the returned number of tokens varies depending on the size of the swap

` 1 ETH - 0.996006981039903216`
` 10 ETH - 0.985199344233659966`
` 100 ETH - 0.887894610225887842`

This is smaller than expected. The constant product formula is in fact a hyperbola, thus the x any y axis cannot be crossed which makes reserves infinite. One implication of the formula is that the larger the swap, the fewer number of tokens returned - otherwise known as slippage.

Tokens are exchanged for Eth by calling tokenToEth(). The pool is reset to a 1:1 ratio by withdrawing liquidity and recalling init()

The amount of ETH returned varies on the size of the swap. The larger the swap the less ETH returned.

`1 BAL - 0.993039757447300166`
`10 BAL - 0.951296851599130328`
`100 BAL - 0.66197812517710483`

---

`02-DEX-liquidity.test.js`

Liquidity is added in proportion to the balance of the pool. The pool is initialised with 500 Eth and 500 BAL tokens, representing a 1:1 ratio. Any subsequent deposits in ETH will result in an equivalent deposit of BAL tokens.

The pool is reinitialised with a 2:1 ratio of BAL/ETH. Subsequent deposits in ETH will result in an 2x deposit of BAL tokens.

---

`03-DEX-fees.test.js`

The pool is initialised with 100 ETH/BAL with a further 100 ETH/BAL liquidity added. This test proves the DEX BAL balance increases by 0.005961371714874986 after swapping 1 ETH/BAL in and 1 ETH/BAL out again.

The LP provider withdraws their liquidity, plus the additional fees accrued. Where multiple LPs remove liquidity, they receive fee profits proportional to their liquidity balance.
