const hre = require("hardhat");

const { ethers } = hre;
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { parseEther, parseUnits } = require("ethers/lib/utils");

use(solidity);

describe("Simple Token Example", function () {
  this.timeout(120000);

  let token, vendor, deployer, addr2;
  const totalSupply = "10000";
  const tokensPerEth = "10";
  const ethValue = "0.1";

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
        token.transfer(vendor.address, parseEther(totalSupply));
      });
    }

    // describe("buyTokens", function () {
    it("Should allow vendor to sell tokens", async function () {
      [deployer, addr2] = await ethers.getSigners();

      const startingBalance = await token.balanceOf(deployer.address);
      console.log("\t", " ⚖️ Starting balance: ", startingBalance.toNumber());
      expect(await token.balanceOf(deployer.address)).to.equal(0);
      expect(await token.balanceOf(vendor.address)).to.equal(
        parseEther(totalSupply)
      );

      console.log("\t", " 🔨 Transferring...");
      const buyTokensResult = await vendor
        .connect(deployer)
        .buyTokens(deployer.address, {
          value: ethers.utils.parseEther("0.1"),
        });
      console.log("\t", " 🏷  mint tx: ", buyTokensResult.hash);

      console.log("\t", " ⏳ Waiting for confirmation...");
      const txResult = await buyTokensResult.wait(0);

      console.log(
        "\t",
        " 🔎 Checking new balance: ",
        startingBalance.toNumber()
      );
      expect(await token.balanceOf(deployer.address)).to.equal(parseEther("1"));
      const balance = totalSupply - ethValue * tokensPerEth;
      expect(await token.balanceOf(vendor.address)).to.equal(
        parseEther(balance.toString())
      );
    });
  });

  describe("ownership", function () {
    it("Should determine deployership", async function () {
      const [deployer, addr2] = await ethers.getSigners();
      expect(await vendor.owner()).to.equal(deployer.address);
    });

    it("transfer ownership", async function () {
      await vendor.transferOwnership(addr2.address);
      expect(await vendor.owner()).to.equal(addr2.address);
    });
  });

  describe("withdrawal", async function () {
    it("confirms owner", async function () {
      expect(await vendor.owner()).to.equal(addr2.address);
      // only contract owner can withdraw balance
      await expect(vendor.withdraw()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("withdraws eth from contract", async function () {
      const balance = totalSupply - ethValue * tokensPerEth;
      expect(await vendor.balance()).to.equal(parseEther(ethValue));
    });
  });
});
