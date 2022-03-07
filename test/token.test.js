const hre = require("hardhat");
// import { formatEther } from "@ethersproject/units";

const { ethers } = hre;
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { parseEther, parseUnits, formatEther } = require("ethers/lib/utils");
const { parse } = require("@ethersproject/transactions");

use(solidity);
// use hardhat config

describe("Simple Token Example", function () {
  this.timeout(120000);

  let token, vendor, deployer, buyer, addr2, owner;
  const totalSupply = 1000;
  const tokensPerEth = 1;
  const ethAmount = 1;
  const sellAmount = 1;
  const prov = ethers.provider;

  beforeEach(async function () {
    [deployer, buyer, addr2, owner] = await ethers.getSigners();
  });

  // console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  describe("Token", function () {
    if (process.env.CONTRACT_ADDRESS) {
      it("Should connect to external contract", async function () {
        token = await ethers.getContractAt(
          "Token",
          process.env.CONTRACT_ADDRESS
        );
        console.log("     🛰 Connected to external contract", token.address);
      });
    } else {
      it("Should deploy contracts", async function () {
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        const Vendor = await ethers.getContractFactory("Vendor");
        vendor = await Vendor.deploy(token.address);

        // transfer balance to vendor
        token.transfer(vendor.address, totalSupply);
      });
    }

    describe("BuyTokens", function () {
      it("Should allow vendor to sell tokens", async function () {
        // vendor has initial token supply
        let startingBalance = await token.balanceOf(vendor.address);
        console.log("\t", " ⚖️ Starting balance: ", startingBalance.toNumber());
        expect(await token.balanceOf(deployer.address)).to.equal(0);
        expect(await token.balanceOf(vendor.address)).to.equal(totalSupply);
        // deployer buys back 1 eth of tokens (1 TKNS)
        console.log("\t", " 🔨 Transferring...");
        const buyTokensResult = await vendor.connect(deployer).buyTokens({
          value: parseEther("1"),
        });

        console.log("\t", " 🏷  mint tx: ", buyTokensResult.hash);
        console.log("\t", " ⏳ Waiting for confirmation...");
        const txResult = await buyTokensResult.wait(0);
        startingBalance = await token.balanceOf(deployer.address);
        console.log(
          "\t",
          " 🔎 Checking new buyer balance: ",
          startingBalance.toString()
        );

        expect(await token.balanceOf(deployer.address)).to.equal(
          ethAmount * tokensPerEth
        );
        let balance = await prov.getBalance(vendor.address);
        // ); // 1 * 10  = 10 tokens
        balance = totalSupply - ethAmount * tokensPerEth; // 9990 tokens

        expect(await token.balanceOf(vendor.address)).to.equal(
          balance.toString()
        );
      });
    });

    describe("Ownership", function () {
      it("Should determine owner", async function () {
        expect(await vendor.owner()).to.equal(deployer.address);
      });

      it("Transfer ownership", async function () {
        await vendor.transferOwnership(owner.address);
        expect(await vendor.owner()).to.equal(owner.address);
        await expect(vendor.withdraw()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("Withdrawal", async function () {
      it("Withdraws eth from contract", async function () {
        // 1 eth in contract balance
        expect(await vendor.balance()).to.equal(parseEther("1"));
        // inital 10,000 account balance
        expect(await prov.getBalance(owner.address)).to.be.gte(
          parseEther("10000")
        );
        // owner address own can withdraw eth
        expect(await vendor.owner()).to.equal(owner.address); // addr is owner
        await vendor.connect(owner).withdraw(); // owner withdraws eth

        // vendor account eth is withdrawn
        expect(await prov.getBalance(vendor.address)).to.be.equal(0);

        balanceAfterWithdrawal = await prov.getBalance(owner.address);
        // owner account balance increases by 1eth
        expect(await prov.getBalance(owner.address)).to.equal(
          balanceAfterWithdrawal.toString()
        );
      });
    });
  });

  describe("Verify balances", function () {
    it("Checks vendor balance", async () => {
      expect(await token.balanceOf(vendor.address)).to.be.equal(
        totalSupply - ethAmount * tokensPerEth
      );
      expect(await token.balanceOf(deployer.address)).to.be.equal(
        ethAmount * tokensPerEth
      );
      startingBalance = await token.balanceOf(deployer.address);

      const buyTokensResult = await vendor.connect(deployer).buyTokens({
        value: parseEther("1"),
      });
      const newBalance = startingBalance.toNumber() + ethAmount * tokensPerEth;

      expect(await token.balanceOf(deployer.address)).to.equal(newBalance);
      console.log("\t", " 🏷  mint tx: ", buyTokensResult.hash);
      console.log("\t", " ⏳ Waiting for confirmation...");
      const txResult = await buyTokensResult.wait(0);
      startingBalance = await token.balanceOf(deployer.address);
      console.log(
        "\t",
        " 🔎 Checking new buyer balance: ",
        startingBalance.toString()
      );
      const vendorBalance = await token.balanceOf(vendor.address);
      console.log(
        "\t",
        " 🔎 Checking new vendor balance: ",
        vendorBalance.toString()
      );
    });
    it("Cannot exceed vendor token supply", async () => {
      vendorBalance = await token.balanceOf(vendor.address);
      const buyTokensResult = await vendor.connect(deployer).buyTokens({
        value: parseEther("98"),
      });
      vendorBalance = await token.balanceOf(vendor.address);
      console.log(
        "\t",
        " 🔎 Checking new vendor balance: ",
        vendorBalance.toString()
      );

      await expect(
        vendor.connect(deployer).buyTokens({ value: parseEther("901") })
      ).to.be.revertedWith("Exceeds vendor token balance");
    });
  });

  describe("Approvals", function () {
    it("Requires vendor approval", async () => {
      await expect(vendor.sellTokens(sellAmount)).to.be.revertedWith(
        "ERC20: transfer amount exceeds allowance"
      );
      await token.connect(deployer).approve(vendor.address, 1000);
      deployerEthBal = await prov.getBalance(deployer.address);
      vendorEthBal = await prov.getBalance(vendor.address);
      deployerTokenBal = await token.balanceOf(deployer.address);
      vendorTokenBal = await token.balanceOf(vendor.address);
      console.log(
        "\t",
        " 🔎 Checking deployer eth balance: ",
        formatEther(deployerEthBal),
        "eth"
      );
      console.log(
        "\t",
        " 🔎 Checking deployer Token balance: ",
        deployerTokenBal.toString(),
        "TKN"
      );

      console.log(
        "\t",
        " 🔎 Checking vendor eth balance: ",
        formatEther(vendorEthBal),
        "eth"
      );
      console.log(
        "\t",
        " 🔎 Checking vendor Token balance: ",
        vendorTokenBal.toString(),
        "TKN"
      );
    });
    it("sells to approved contract", async () => {
      // Sell single token to vendor
      const sellTokensResult = await vendor.sellTokens(sellAmount);

      // vendor Token balance increases
      expect(await token.balanceOf(vendor.address)).to.be.gt(vendorTokenBal);
      // deployer Token balance decreases
      expect(await token.balanceOf(deployer.address)).to.be.equal(
        deployerTokenBal - sellAmount
      );
      // vendor eth balance has decreased by 1 eth
      expect(await prov.getBalance(vendor.address)).to.be.lt(vendorEthBal);
      // deployer eth balance has increased by ~ 1 eth
      expect(await prov.getBalance(deployer.address)).to.be.gt(deployerEthBal);
    });
  });
});
