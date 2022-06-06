const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-waffle");

const toWei = (value) => ethers.utils.parseEther(value.toString());
const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );

describe("Factory", () => {
  let factory, owner, token;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.deploy();
    await factory.deployed();

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Token", "TKN", toWei(10000));
    await token.deployed();
  });

  it("is deployed", async () => {
    expect(await factory.deployed()).to.equal(factory);
  });

  describe("create exchange", () => {
    it("creates an exchange", async () => {
      // callStatic -Rather than executing the state-change of a transaction,
      //it is possible to ask a node to pretend that a call is not state-changing and return the result.
      const exchangeAddress = await factory.callStatic.createExchange(
        token.address
      );

      await factory.createExchange(token.address);
      const Exchange = await ethers.getContractFactory("ExchangeB");
      // attach - Return an instance of a Contract attached to address. This is the same as using the
      //Contract constructor with address and this the interface and signerOrProvider
      //passed in when creating the ContractFactory.
      const exchange = await Exchange.attach(exchangeAddress);

      expect(await exchange.name()).to.eq("ZSwap-V1");
      expect(await exchange.symbol()).to.eq("ZSP-V1");
      expect(await exchange.factoryAddress()).to.eq(factory.address);
    });

    it("doesnt alllow a zero address", async () => {
      await expect(
        factory.createExchange("0x0000000000000000000000000000000000000000")
      ).to.be.revertedWith("invalid token address");
    });

    it("must be a new token address", async () => {
      await factory.createExchange(token.address);
      await expect(factory.createExchange(token.address)).to.be.revertedWith(
        "token already exists"
      );
    });
  });

  describe("get exchange", async () => {
    it("returns the token from exchange", async () => {
      const exchangeAddress = await factory.callStatic.createExchange(
        token.address
      );
      await factory.createExchange(token.address);
      expect(await factory.getExchange(token.address)).to.eq(exchangeAddress);
    });
  });
});
