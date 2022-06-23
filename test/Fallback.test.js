const {ethers} = require("hardhat");
const {use, expect} = require("chai");
const {solidity} = require("ethereum-waffle");

use(solidity);

const toWei = value => ethers.utils.parseEther(value.toString());
const fromWei = value => ethers.utils.formatEther(typeof value === "string" ? value : value.toString());

const getBalance = ethers.provider.getBalance;

const removeFunctionParameters = data => {
  let returnedData = data.slice(0, 10);
  return returnedData;
};

/**
 * @notice
 * Stages of testing are as follows: set up global test variables, test contract deployment,
 * deploy contracts in beforeEach(), then actually test out each separate function.
 */
describe("Fallback Function", function () {
  this.timeout(45000);

  let fallback;
  let callFallback;
  let deployer;
  const amount = 1;

  // assign 'signer' addresses as object properties (Strings) to user array -->
  before(async function () {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
  });

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before(done => {
    setTimeout(done, 2000);
  });

  describe("Deploy fallback contract", function () {
    // 1st check if DEX contract already deployed, otherwise balloons needs to be deployed!

    it("should deploy contracts", async function () {
      let Fallback = await ethers.getContractFactory("Fallback");
      fallback = await Fallback.deploy();
      let CallFallback = await ethers.getContractFactory("CallFallback");
      callFallback = await CallFallback.deploy();
    });
  });

  describe("Sends Ether", async () => {
    it("invokes the receive function", async () => {
      // No data is sent with the function call

      await expect(callFallback.payContract(fallback.address, "0x", {value: toWei(1)})).to.emit(
        fallback,
        "ReceiveEvent"
      );
    });

    it("invokes the fallback function", async () => {
      await expect(callFallback.payContract(fallback.address, "0x01", {value: toWei(1)})).to.emit(
        fallback,
        "FallbackEvent"
      );

      // Using fake ABI
      // create a fake fallback contract to make hardhat beleive this function signature does exsist
      const nonExistentFuncSignature = "nonExistentFunction(string)";
      const fakeFallbackFunction = new ethers.Contract(
        fallback.address,
        [...fallback.interface.fragments, `function ${nonExistentFuncSignature}`],
        deployer
      );

      const tx = await fakeFallbackFunction[nonExistentFuncSignature]("message");
      await expect(tx).to.emit(fallback, "FallbackEvent");

      let rc = await tx.wait();
      let event = rc.events.find(event => event.event === "FallbackEvent");
      const [eventType, sender, value, data] = event.args;
      expect(eventType).to.eq("Fallback");
      expect(sender).to.eq(deployer.address);
      expect(value).to.eq(toWei(0));
    });
  });

  describe("Returning the function selector", async () => {
    it("returns the function selector", async () => {
      let funcSelect = await callFallback.functionSelector("functionSelector(string)");
      let callData = callFallback.interface.encodeFunctionData("functionSelector", ["message"]);
      expect(funcSelect).to.eq(removeFunctionParameters(callData));
    });
  });
});
