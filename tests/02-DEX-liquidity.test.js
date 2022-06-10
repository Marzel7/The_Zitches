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
describe("DEX liquidity", function () {
  this.timeout(45000);

  let dexContract;
  let balloonsContract;
  let deployer;
  let user2;
  let user3;
  let balances;
  let TOKEN_AMOUNT = 500;
  let TOTAL_SUPPLY = 10000;

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
    // 1st check if DEX contract already deployed, otherwise balloons needs to be deployed!
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
    it("Should set up DEX with 500 BAL at start", async function () {
      await balloonsContract
        .connect(deployer.signer)
        .approve(dexContract.address, toWei(TOTAL_SUPPLY));

      await balloonsContract
        .connect(user2.signer)
        .approve(dexContract.address, toWei(TOTAL_SUPPLY));

      await dexContract.connect(deployer.signer).init(toWei(500), {
        value: toWei(500),
      });
      await balloonsContract
        .connect(deployer.signer)
        .transfer(user2.address, toWei(500));

      expect(await getBalance(dexContract.address)).to.eq(toWei(500));
      expect(await balloonsContract.balanceOf(dexContract.address)).to.eq(
        toWei(500)
      );
      expect(await balloonsContract.balanceOf(deployer.address)).to.eq(
        toWei(TOTAL_SUPPLY - 1000)
      );
      expect(await balloonsContract.balanceOf(user2.address)).to.eq(toWei(500));
    });
  });

  describe("multiple liquidity providers", async () => {
    it("deployer provides liquidity", async () => {
      let tx1 = await dexContract.deposit({ value: toWei(500) });
      let rc = await tx1.wait();
      let event = rc.events.find(
        (event) => event.event === "LiquidityProvided"
      );
      const [
        liquidityProvider,
        ethInput,
        tokensInput,
        newLiquidityPosition,
        liquidityMinted,
        totalLiquidity,
      ] = event.args;
      expect(liquidityProvider).to.eq(deployer.address);
      expect(ethInput).to.eq(toWei(500));
      expect(tokensInput).to.eq(toWei(500));
      expect(newLiquidityPosition).to.eq(toWei(1000)); // initialisation + liquidity
      expect(liquidityMinted).to.eq(toWei(500));
      expect(totalLiquidity).to.eq(toWei(1000)); // initialisation + liquidity
    });

    it("account2 provides liquidity", async () => {
      let tx2 = await dexContract
        .connect(user2.signer)
        .deposit({ value: toWei(500) });
      let rc = await tx2.wait();
      let event = rc.events.find(
        (event) => event.event === "LiquidityProvided"
      );
      const [
        liquidityProvider,
        ethInput,
        tokensInput,
        newLiquidityPosition,
        liquidityMinted,
        totalLiquidity,
      ] = event.args;
      expect(liquidityProvider).to.eq(user2.address);
      expect(ethInput).to.eq(toWei(500));
      expect(tokensInput).to.eq(toWei(500));
      expect(newLiquidityPosition).to.eq(toWei(500));
      expect(liquidityMinted).to.eq(toWei(500));
      expect(totalLiquidity).to.eq(toWei(1500));
    });

    it("account2  withdraws liquidity", async () => {
      // token balances
      expect(await balloonsContract.balanceOf(deployer.address)).to.eq(
        toWei(8500)
      );
      expect(await balloonsContract.balanceOf(user2.address)).to.eq(toWei(0));

      let tx1 = await dexContract.connect(user2.signer).withdraw(toWei(500));
      let rc = await tx1.wait();
      let event = rc.events.find((event) => event.event === "LiquidityRemoved");
      const [
        liquidityProvider,
        ethOutput,
        tokenOutput,
        newLiquidityPosition,
        liquidityWithdrawn,
        totalLiquidity,
      ] = event.args;
      expect(liquidityProvider).to.eq(user2.address);
      expect(ethOutput).to.eq(toWei(500));
      expect(tokenOutput).to.eq(toWei(500));
      expect(newLiquidityPosition).to.eq(0);
      expect(liquidityWithdrawn).to.eq(toWei(500));
      expect(totalLiquidity).to.eq(toWei(1000));
    });

    it("deployer removes liquidity", async () => {
      let tx1 = await dexContract.withdraw(toWei(500));
      let rc = await tx1.wait();
      let event = rc.events.find((event) => event.event === "LiquidityRemoved");
      const [
        liquidityProvider,
        ethOutput,
        tokenOutput,
        newLiquidityPosition,
        liquidityWithdrawn,
        totalLiquidity,
      ] = event.args;
      expect(liquidityProvider).to.eq(deployer.address);
      expect(ethOutput).to.eq(toWei(500));
      expect(tokenOutput).to.eq(toWei(500));
      expect(newLiquidityPosition).to.eq(toWei(500)); // from initialisation
      expect(liquidityWithdrawn).to.eq(toWei(500));
      expect(totalLiquidity).to.eq(toWei(500));
      //updated token balances
      expect(await balloonsContract.balanceOf(deployer.address)).to.eq(
        toWei(9000)
      );
      expect(await balloonsContract.balanceOf(user2.address)).to.eq(toWei(500));
    });
  });

  describe("multi-provider liquidity pools", async () => {
    it("inits pools at 2:1 ratio", async () => {
      // withdraw funds and re-init pool
      await dexContract.connect(deployer.signer).withdraw(toWei(500));
      await dexContract
        .connect(deployer.signer)
        .init(toWei(500 * 2), { value: toWei(500) });
      console.log(await balances());
    });

    it("adds liquidity balanced to 2:1", async () => {
      expect(await balloonsContract.balanceOf(user2.address)).to.eq(toWei(500));

      await dexContract
        .connect(user2.signer)
        .deposit({ value: toWei(500 / 2) });

      expect(await balloonsContract.balanceOf(user2.address)).to.eq(toWei(0));
      expect(await getBalance(dexContract.address)).to.eq(toWei(500 + 500 / 2));
    });

    it("withdraws liquidity after ETH/TOKEN swap", async () => {
      const withdrawAmount = 10;
      //   await dexContract
      //     .connect(deployer.signer)
      //     .ethToToken({ value: toWei(10) });
      //   console.log("balance before withdrawal", await balances());

      /// Calculate liquidity withdrawl allocation
      const ethReserve = await getBalance(dexContract.address);
      const totalLiquidityBal = await dexContract.totalLiquidity();

      const liquidityAmountWithdrawn =
        (ethReserve * withdrawAmount) / totalLiquidityBal;

      /// Calculate token withdrawl allocation
      const tokenReserve = await balloonsContract.balanceOf(
        dexContract.address
      );
      const tokenAmountWithdrawn =
        (tokenReserve * withdrawAmount) / totalLiquidityBal;

      let tx1 = await dexContract
        .connect(user2.signer)
        .withdraw(toWei(withdrawAmount));
      let rc = await tx1.wait();
      let event = rc.events.find((event) => event.event === "LiquidityRemoved");

      console.log("**************");
      console.log("requested liquidity withdrawn - ", withdrawAmount, "eth");
      console.log(
        "actual liquidity withdrawn",
        liquidityAmountWithdrawn,
        "eth"
      );
      console.log("**************");
      console.log("withdrawn token amount", tokenAmountWithdrawn);
      console.log("balance after withdrawal", await balances());

      const [
        liquidityProvider,
        ethOutput,
        tokenOutput,
        newLiquidityPosition,
        liquidityWithdrawn,
        totalLiquidity,
      ] = event.args;

      expect(liquidityProvider).to.eq(user2.address);
      expect(Number(fromWei(ethOutput))).to.eq(liquidityAmountWithdrawn);
      expect(Number(fromWei(tokenOutput))).to.eq(tokenAmountWithdrawn);
      expect(newLiquidityPosition).to.eq(toWei(240));
      expect(Number(fromWei(liquidityWithdrawn))).to.eq(
        liquidityAmountWithdrawn
      );
      expect(totalLiquidity).to.eq(toWei(740));
    });
  });
});
