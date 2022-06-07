const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const toWei = (value) => ethers.utils.parseEther(value.toString());
const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );

const getBalance = ethers.provider.getBalance;

/**
 * @notice auto-grading tests for simpleDEX challenge
 * Stages of testing are as follows: set up global test variables, test contract deployment, deploy contracts in beforeEach(), then actually test out each separate function.
 * @dev this is still a rough WIP. See TODO: scattered throughout.'
 * @dev additional TODO: Write edge cases; putting in zero as inputs, or whatever.
 */
describe("DEX", function () {
  this.timeout(45000);

  let dexContract;
  let balloonsContract;
  let deployer;
  let user2;
  let user3;
  let balances;
  let deployerEthBal;
  let deployerTokenBal;

  // assign 'signer' addresses as object properties (Strings) to user array --> this is so we have signers ready to test this thing.
  before(async function () {
    const getAccounts = async function () {
      let accounts = [];
      let signers = [];
      signers = await hre.ethers.getSigners();
      for (const signer of signers) {
        accounts.push({ signer, address: await signer.getAddress() });
      } //populates the accounts array with addresses.
      return accounts;
    };
    [deployer, user2, user3] = await getAccounts();
  });

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("DEX: deployment", function () {
    // 1st check if DEX contract already deployed, otherwise balloons needs to be deployed! TODO: have to figure out what account is the deployer if the challenger submits with a .env file!
    if (process.env.CONTRACT_ADDRESS) {
      it("Should connect to dex contract", async function () {
        dexContract = await ethers.getContractAt(
          "DEX",
          process.env.CONTRACT_ADDRESS
        );
        console.log("     🛰 Connected to DEX contract", dexContract.address);
      });
    } else {
      it("Should deploy Balloons contract", async function () {
        const BalloonsContract = await ethers.getContractFactory(
          "Balloons",
          deployer
        );
        balloonsContract = await BalloonsContract.deploy();
      });
      it("Should deploy DEX", async function () {
        const Dex = await ethers.getContractFactory("DEX", deployer);
        dexContract = await Dex.deploy(balloonsContract.address);

        balances = async () => {
          let ethBalance = await getBalance(dexContract.address);
          let tokenBalance = await balloonsContract.balanceOf(
            dexContract.address
          );
          let deployerLiquidityBalance = await dexContract.getLiquidity(
            deployer.address
          );
          let user2LiquidityBalance = await dexContract.getLiquidity(
            user2.address
          );
          console.log("*** ETH / BAL ***");
          return [
            fromWei(ethBalance),
            fromWei(tokenBalance),
            fromWei(ethBalance) / fromWei(tokenBalance),
            fromWei(deployerLiquidityBalance),
            fromWei(user2LiquidityBalance),
          ];
        };
      });
    }
  });
  describe("init()", function () {
    it("Should set up DEX with 10 BAL at start", async function () {
      const TOKEN_AMOUNT = 10;
      const APPROVAL_AMOUNT = 1000;
      // approvals
      await balloonsContract
        .connect(deployer.signer)
        .approve(dexContract.address, toWei(APPROVAL_AMOUNT));
      await balloonsContract
        .connect(user2.signer)
        .approve(dexContract.address, toWei(APPROVAL_AMOUNT));
      await balloonsContract
        .connect(user3.signer)
        .approve(dexContract.address, toWei(APPROVAL_AMOUNT));

      // store deployer eth balance
      deployerEthBal = fromWei(await getBalance(deployer.address));

      // transfer BAL tokens between accounts
      await balloonsContract
        .connect(deployer.signer)
        .transfer(user2.address, toWei(500));
      await balloonsContract
        .connect(deployer.signer)
        .transfer(user3.address, toWei(250));

      // store deployer token balance
      deployerTokenBal = fromWei(
        await balloonsContract.balanceOf(deployer.address)
      );

      //initialise pool
      await dexContract.connect(deployer.signer).init(toWei(TOKEN_AMOUNT), {
        value: toWei(TOKEN_AMOUNT),
      });

      expect(await getBalance(dexContract.address)).to.eq(toWei(TOKEN_AMOUNT));
      expect(await balloonsContract.balanceOf(dexContract.address)).to.eq(
        toWei(TOKEN_AMOUNT)
      );
      expect(await balloonsContract.balanceOf(deployer.address)).to.eq(
        toWei(240)
      );
      expect(await balloonsContract.balanceOf(user2.address)).to.eq(toWei(500));
      expect(await balloonsContract.balanceOf(user3.address)).to.eq(toWei(250));
    });
  });
  describe("liquidity", function () {
    it("provides liquidity", async function () {
      await dexContract.connect(deployer.signer).deposit({
        value: toWei(240),
      });
    });
  });
  describe("TokenSwap", function () {
    it("executes swaps", async function () {
      const FEE_AMOUNT = 1.003;
      let tokenToEthSwapAmount = 50;

      for (var i = 0; i <= 5; i++) {
        let tx1 = await dexContract
          .connect(user2.signer)
          .tokenToEth(toWei(tokenToEthSwapAmount));

        let rc = await tx1.wait();
        let event = rc.events.find((event) => event.event === "TokenToEthSwap");
        const [sender, message, ethOutput, tokenInput] = event.args;
        let ethToTokenSwapAmount = fromWei(ethOutput) * FEE_AMOUNT;
        console.log("ethToTokenSwapAmount", ethToTokenSwapAmount);
        console.log(await balances());

        let tx2 = await dexContract
          .connect(user2.signer)
          .ethToToken({ value: toWei(ethToTokenSwapAmount) });

        rc = await tx2.wait();
        event = rc.events.find((event) => event.event === "EthToTokenSwap");
        let [tx2sender, tx2message, tx2ethInput, tx2Output] = event.args;

        tokenToEthSwapAmount = fromWei(tx2Output) * FEE_AMOUNT;
        console.log("tokenToEthSwapAmount ", tokenToEthSwapAmount);
        console.log(await balances());
      }
    });
  });
  describe("withdraws liquidity", function () {
    it("withdraws liquidity with profit from fees", async function () {
      await dexContract.connect(deployer.signer).withdraw(toWei(250));
      deployerEthBalUpdated = fromWei(await getBalance(deployer.address));
      deployerTokenBalUpdated = fromWei(
        await balloonsContract.balanceOf(deployer.address)
      );
      // Confirm deployer eth and token balances have increased from fee profits
      expect(Number(deployerEthBalUpdated)).to.be.greaterThan(
        Number(deployerEthBal)
      );
      expect(Number(deployerTokenBalUpdated)).to.be.gt(
        Number(deployerTokenBal)
      );
    });
  });
});
