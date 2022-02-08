const hre = require("hardhat");

const { ethers } = hre;
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Simple Token Example", function () {
  this.timeout(120000);

  let token, vendor;
  const totalSupply = 1000;

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
        token.transfer(vendor.address, totalSupply);
      });
    }

    describe("buyTokens()", function () {
      it("Should allow vendor to sell tokens", async function () {
        const [deployer] = await ethers.getSigners();

        const startingBalance = await token.balanceOf(deployer.address);
        console.log("\t", " ⚖️ Starting balance: ", startingBalance.toNumber());
        expect(await token.balanceOf(deployer.address)).to.equal(0);
        expect(await token.balanceOf(vendor.address)).to.equal(1000);

        console.log("\t", " 🔨 Transferring...");
        const buyTokensResult = await vendor.connect(deployer).buyTokens(100);
        console.log("\t", " 🏷  mint tx: ", buyTokensResult.hash);

        console.log("\t", " ⏳ Waiting for confirmation...");
        const txResult = await buyTokensResult.wait(0);

        console.log(
          "\t",
          " 🔎 Checking new balance: ",
          startingBalance.toNumber()
        );
        expect(await token.balanceOf(deployer.address)).to.equal(100);
        expect(await token.balanceOf(vendor.address)).to.equal(900);
      });
    });
  });
});
