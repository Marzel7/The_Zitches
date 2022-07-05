### Low Level Solidity Functions

This branch demonstates how to sign messages using ether.js.

### install

```bash
git clone https://github.com/kkeaveney/The_Zitches.git dex
cd dex
git checkout dex
yarn install
```

### Tests

`Fallback.test.js`

A fallback function is an external function without a name, parameters, or a return value. It is executed if the function identifier doesn't match any if the available functions or no data was supplied with the function call. For example, sending ETH to a contract without any data.

Solidity 6.0 introduced the receive keyword to make contracts more explicit when their callback functions are called.
The recieve method is used as a fallback function when ether is sent to a contract with no calldata. If the receive method does not exsist, the fallback function is used.

This test demonstrates the different use cases for receive and fallback funcitons. In the first test, a call between contracts logs the recieve event as calldata is empty. An EOA in the second test sends ether to the contract with additional calldata, which in turns executes the fallback function and emits a fallback event.

As the call method doesn't throw any error (bool success) checks the success of the execution.

---
