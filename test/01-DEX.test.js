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
 * @notice
 * Stages of testing are as follows: set up global test variables, test contract deployment,
 * deploy contracts in beforeEach(), then actually test out each separate function.
 */
describe("Simple DEX", function () {
  this.timeout(45000);

  let dexContract;
  let balloonsContract;
  let deployer;
  let user2;
  let user3;
  let balances;

  // assign 'signer' addresses as object properties (Strings) to user array -->
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

  describe("DEX: Standard Path", function () {
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
          console.log("*** ETH / BAL ***");
          return [fromWei(ethBalance), fromWei(tokenBalance)];
        };
      });
    }

    // see if initial setup works, should have 1000 balloons in totalSupply, and 500 balloons + 500 ETH within DEX.
    // This set up will be used continuously afterwards for nested function tests.

    describe("init()", function () {
      it("Should set up DEX with 1000 balloons at start", async function () {
        let tx2 = await balloonsContract
          .connect(deployer.signer)
          .approve(dexContract.address, toWei(1000));

        await expect(tx2)
          .emit(balloonsContract, "Approval")
          .withArgs(deployer.address, dexContract.address, toWei(1000));
        let tx3 = await dexContract.connect(deployer.signer).init(toWei(500), {
          value: toWei(500),
        });

        await expect(tx3).emit(balloonsContract, "Transfer");

        await expect(
          dexContract.connect(deployer.signer).init(toWei(500))
        ).to.be.revertedWith("DEX already has liquidity");
      });
    });

    describe("ethToToken", function () {
      it("Should send less tokens after the first trade (ethToToken called)", async function () {
        let tx1 = await dexContract.connect(deployer.signer).ethToToken({
          value: toWei(1),
        });

        let tx2 = await dexContract.connect(deployer.signer).ethToToken({
          value: toWei(10),
        });

        let tx3 = await dexContract.connect(user2.signer).ethToToken({
          value: toWei(100),
        });

        let rc = await tx1.wait(); // 0ms, as tx is already confirmed
        let event = rc.events.find((event) => event.event === "EthToTokenSwap");
        const [tx1from, tx1to, tx1value, tx1TokenAmount] = event.args;
        await expect(tx1)
          .emit(dexContract, "EthToTokenSwap")
          .withArgs(deployer.address, "Eth to BAL", toWei(1), tx1TokenAmount);

        rc = await tx2.wait(); // 0ms, as tx is already confirmed
        event = rc.events.find((event) => event.event === "EthToTokenSwap");
        const [tx2from, tx2to, tx2value, tx2TokenAmount] = event.args;
        await expect(tx2)
          .emit(dexContract, "EthToTokenSwap")
          .withArgs(deployer.address, "Eth to BAL", toWei(10), tx2TokenAmount);

        rc = await tx3.wait(); // 0ms, as tx is already confirmed
        event = rc.events.find((event) => event.event === "EthToTokenSwap");
        const [fromtx3, totx3, valuetx3, tx3TokenAmount] = event.args;
        await expect(tx3)
          .emit(dexContract, "EthToTokenSwap")
          .withArgs(user2.address, "Eth to BAL", toWei(100), tx3TokenAmount);
        expect(tx1TokenAmount).to.be.gt(tx2TokenAmount.div(10));
        expect(tx2TokenAmount).to.be.gt(tx3TokenAmount.div(100));

        // console.log(
        //   "token amount from 1st Eth/Token swap",
        //   fromWei(tx1TokenAmount)
        // );

        // console.log(
        //   "token amount from 2nd Eth/Token swap",
        //   fromWei(tx2TokenAmount.div(10))
        // );
        // console.log(
        //   "token amount from 3rd Eth/Token swap",
        //   fromWei(tx3TokenAmount.div(100))
        // );
      });
    });

    describe("tokenToEth", async () => {
      it("Rebalances pool", async function () {
        await dexContract.connect(deployer.signer).withdraw(toWei(500));

        await dexContract
          .connect(deployer.signer)
          .init(toWei(250), { value: toWei(250) });
      });

      it("Should send less tokens after the first trade (tokenToEth() called)", async function () {
        let tx1 = await dexContract
          .connect(deployer.signer)
          .tokenToEth(toWei(1));
        let rc = await tx1.wait();
        let event = rc.events.find((event) => event.event === "TokenToEthSwap");
        let [from, to, tx1ethOutput, tokenInput] = event.args;

        let tx2 = await dexContract
          .connect(deployer.signer)
          .tokenToEth(toWei(10));
        rc = await tx2.wait();
        event = rc.events.find((event) => event.event === "TokenToEthSwap");
        let [tx2from, tx2to, tx2ethOutput, tx2tokenInput] = event.args;
        expect(tx1ethOutput).to.be.gt(tx2ethOutput.div(10));

        await expect(tx2)
          .emit(dexContract, "TokenToEthSwap")
          .withArgs(deployer.address, "BAL to ETH", tx2ethOutput, toWei(10));

        let tx3 = await dexContract
          .connect(deployer.signer)
          .tokenToEth(toWei(100));
        rc = await tx3.wait();
        event = rc.events.find((event) => event.event === "TokenToEthSwap");
        let [tx3from, tx3to, tx3ethOutput, tx3tokenInput] = event.args;
        expect(tx2ethOutput).to.be.gt(tx3ethOutput.div(100));

        await expect(tx3)
          .emit(dexContract, "TokenToEthSwap")
          .withArgs(deployer.address, "BAL to ETH", tx3ethOutput, toWei(100));

        // console.log(
        //   "eth amount from 1st Token/ETH Swap",
        //   fromWei(tx1ethOutput)
        // );
        // console.log(
        //   "eth amount from 2nd Token/ETH Swap",
        //   fromWei(tx2ethOutput.div(10))
        // );
        // console.log(
        //   "eth amount from 3rd Token/ETH Swap",
        //   fromWei(tx3ethOutput.div(100))
        // );
      });
    });

    describe("deposit", async () => {
      it("Rebalances Pools", async () => {
        await dexContract.connect(deployer.signer).withdraw(toWei(250));
        await dexContract.init(toWei(5), { value: toWei(5) });

        expect(await getBalance(dexContract.address)).to.equal(toWei(5));
      });

      it("Should deposit equal ETH and $BAL when pool at 1:1 ratio", async function () {
        let tx2 = await dexContract.connect(deployer.signer).deposit({
          value: toWei(10),
        });

        expect(await getBalance(dexContract.address)).to.equal(toWei(15));
        expect(await balloonsContract.balanceOf(dexContract.address)).to.equal(
          toWei(15)
        );

        expect(await dexContract.getLiquidity(deployer.address)).to.equal(
          toWei(15)
        );

        let rc = await tx2.wait();
        let event = rc.events.find(
          (event) => event.event === "LiquidityProvided"
        );
        const [
          liquidityProvider,
          liquidityProvided,
          tokensDeposited,
          liquidityBalance,
          liquidityMinted,
          totalLiquidity,
        ] = event.args;

        expect(liquidityProvider).to.eq(deployer.address);
        expect(liquidityProvided).to.eq(toWei(10));
        expect(tokensDeposited).to.eq(toWei(10));
        expect(liquidityBalance).to.eq(toWei(15));
        expect(liquidityMinted).to.eq(toWei(10));
        expect(totalLiquidity).to.eq(toWei(15));
      });
    });

    //pool should have 15:15 ETH:$BAL ratio
    describe("withdraw", async () => {
      it("Should withdraw 1 ETH and 1 $BAL when pool at 1:1 ratio", async function () {
        let tx2 = await dexContract.connect(deployer.signer).withdraw(toWei(1));

        expect(await getBalance(dexContract.address)).to.eq(toWei(14));
        let rc = await tx2.wait();
        let event = rc.events.find(
          (event) => event.event === "LiquidityRemoved"
        );
        const [
          liquidityProvider,
          ethOutput,
          tokenOutput,
          newLiquidityPosition,
          liquidityWithdrawn,
          totalLiquidity,
        ] = event.args;

        expect(liquidityProvider).to.eq(deployer.address);
        expect(ethOutput).to.eq(toWei(1));
        expect(tokenOutput).to.eq(toWei(1));
        expect(newLiquidityPosition).to.eq(toWei(14));
        expect(liquidityWithdrawn).to.eq(toWei(1));
        expect(totalLiquidity).to.eq(toWei(14));
      });
    });
  });
});
