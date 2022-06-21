### Signature verification

This branch demonstates how to sign messages using ether.js.

### formula

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




```

### Tests

`VerifySignature.test.js`

This test demonstrates how to prepare a message, sign the messgae and verify the signature.

A signer in ethers is an abstraction of an Ethereum Account and can be used to sign messages and transactions to execute state changing operations. To create a signer a random wallet is instantiated which returns a random mnemonic each time the test runs.

The message is formatted using getMessageHash and returns a keccak256 hash of the inputs (to, amount, value, nonce). The hash is then signed using ethers.signMessage to return a signature. The test will pass if the correct inputs are passed to the verify function, and otherwise fail.

The actual message being signed is not the hash, but the hash prefixed with a message and then hashed again. getEthSignedMessageHash() returns the eth signed message hash. RecoverSigner() takes this hash as input to confirm the signer of the original message.

---
