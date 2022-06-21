const {ethers} = require("hardhat");
const {use, expect} = require("chai");
const {solidity} = require("ethereum-waffle");

use(solidity);

const toWei = value => ethers.utils.parseEther(value.toString());
const fromWei = value => ethers.utils.formatEther(typeof value === "string" ? value : value.toString());

const getBalance = ethers.provider.getBalance;

/**
 * @notice
 * Stages of testing are as follows: set up global test variables, test contract deployment,
 * deploy contracts in beforeEach(), then actually test out each separate function.
 */
describe("Signature Verification", function () {
  this.timeout(45000);

  let verifySigContract;
  let signer;
  let user2;
  const amount = 1;
  const message = "Verify";
  let nonce = 0;
  let signature;

  // assign 'signer' addresses as object properties (Strings) to user array -->
  before(async function () {
    signer = ethers.Wallet.createRandom();
    const accounts = await ethers.getSigners(2);
    user2 = accounts[1];
  });

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before(done => {
    setTimeout(done, 2000);
  });

  describe("Deploy verification contract", function () {
    // 1st check if DEX contract already deployed, otherwise balloons needs to be deployed!

    it("should connect to dex contract", async function () {
      let VerifySignature = await ethers.getContractFactory("VerifySignature");
      verifySigContract = await VerifySignature.deploy();
    });
  });

  describe("Verify signature", async () => {
    it("checks signature", async () => {
      const hash = await verifySigContract.getMessageHash(user2.address, amount, message, nonce);
      signature = await signer.signMessage(ethers.utils.arrayify(hash));

      expect(await verifySigContract.verify(signer.address, user2.address, amount, message, nonce, signature)).to.eq(
        true
      );
      expect(
        await verifySigContract.verify(signer.address, user2.address, amount + 1, message, nonce, signature)
      ).to.eq(false);
    });
    it("verifies the message", async () => {
      const hash = await verifySigContract.getMessageHash(user2.address, amount, message, nonce);
      signature = await signer.signMessage(ethers.utils.arrayify(hash));

      const ethHash = await verifySigContract.getEthSignedMessageHash(hash);
      const recoveredSigner = await verifySigContract.recoverSigner(ethHash, signature);
      console.log("recovered signer", recoveredSigner);
      expect(recoveredSigner).to.eq(signer.address);
    });
  });
});
