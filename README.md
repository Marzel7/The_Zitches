This branch builds a simple decentralised exchange, utilising an automated maker market token-par (ERC20 BALLOONS) and ETH.

Automated market makers embrace various decentralised algorithms. At the core of this AMM is the constant product function -

### formula

```
The formula states that k remains constant no matter what reserves (x and y) are. Every trade increases a reserve of either ether or token and decreases a reserve of either token or ether

(x+Δx)(y−Δy)=xy

Where Δx is the amount of ethers or tokens we’re trading for Δy, amount of tokens or ethers we’re getting in exchange. Having this formula we can now find Δy:

Δy= x+Δx / yΔx
​

```

---

### install

```bash
git clone https://github.com/kkeaveney/The_Zitches.git dex
cd dex
git checkout dex
yarn install
```

### Environment

This branch consists of tests, ERC20 and DEX smart contracts.

`hh compile` compile ERC20, DEX contracts.

`hh run tests` (hardhat backend)

`Balloons.sol` is just an example ERC20 contract that mints 1000 to whatever address deploys it.

`DEX.sol` Tracks a token (ERC20 interface) that we set in the constructor (on deployment).

---

```

```

### Tests

`01-DEX.test.js`

We call the approve function on the ERC20 token to allow the exchange to spend our tokens.

We can see that the DEX starts empty. Calling init() loads our contract up with 5 ETH and Balloons. At this point, the ETH/BAL pool has a 1:1 ratio. Once liquidity has been deposited init() can only be called again if all liquidity has been removed.

Eth is exchange for tokens by calling ethToToken() with 1 ETH. Despite the 1:1 balance of the pool, the returned number of tokens from the first swap is

`0.831248957812239453`

This is smaller than expected. The constant product formula is in fact a hyperbola, thus the x any y axis cannot be crossed which makes reserves infinite. One implication of the formula is that the larger the swap, the fewer number of tokens returned - otherwise known as slippage.

```

```

```

```

```

```
