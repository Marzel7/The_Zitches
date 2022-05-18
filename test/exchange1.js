const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-waffle");

const toWei = (value) => ethers.utils.parseEther(value.toString());
const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );

describe("exchange", async () => {
  let token, exchange, user;
  let totalSupply = toWei(10000);
  const getBalance = ethers.provider.getBalance;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("ZToken", "ZTK", totalSupply);

    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(token.address);

    await token.deployed();
    await exchange.deployed();
  });
  describe("deployment", function () {
    it("deploys Token and Exchange", async function () {
      expect(await token.totalSupply()).to.equal(totalSupply);
      expect(await exchange.getReserve()).to.equal(0);
    });
  });
  describe("add liquidity", async function () {
    it("Adds liquidity", async function () {
      await token.approve(exchange.address, totalSupply);
      await exchange.addLiquidity(totalSupply, { value: toWei(100) });

      expect(await exchange.getReserve()).to.equal(totalSupply);
      expect(await getBalance(exchange.address)).to.equal(toWei(100));
    });
  });
  describe("getPrice", async function () {
    it("returns correct price", async function () {
      await token.approve(exchange.address, totalSupply);
      await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });

      const tokenReserve = await exchange.getReserve();
      const etherReserve = await getBalance(exchange.address);

      // ETH per Token
      expect(await exchange.getPrice(etherReserve, tokenReserve)).to.eq(500);
      // Tokens per Eth
      expect(await exchange.getPrice(tokenReserve, etherReserve)).to.eq(2000);
    });
  });
  describe("getTokenAmount", async function () {
    it("returns token amount", async function () {
      await token.approve(exchange.address, totalSupply);
      await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
      let tokensOut = await exchange.getTokenAmount(toWei(1));
      expect(fromWei(tokensOut)).to.eq("1.998001998001998001");
      tokensOut = await exchange.getTokenAmount(toWei(100));
      expect(fromWei(tokensOut)).to.eq("181.818181818181818181");
      // Try and drain the pool, only half the tokens paid out
      tokensOut = await exchange.getTokenAmount(toWei(1000));
      expect(fromWei(tokensOut)).to.eq("1000.0");
    });
  });
  describe("getEthAmount", async function () {
    it("returns eth amount", async function () {
      await token.approve(exchange.address, totalSupply);
      await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
      let ethOut = await exchange.getEthAmount(toWei(2));
      expect(fromWei(ethOut)).to.eq("0.999000999000999");
      ethOut = await exchange.getEthAmount(toWei(100));
      expect(fromWei(ethOut)).to.eq("47.619047619047619047");
      // Try and drain the pool, only half the tokens paid out
      ethOut = await exchange.getEthAmount(toWei(2000));
      expect(fromWei(ethOut)).to.eq("500.0");
    });
  });
  describe("ethToTokenSwap", async function () {
    beforeEach(async () => {
      await token.approve(exchange.address, toWei(2000));
      await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
    });
    it("transfers at least minimum amount of tokens", async () => {
      const userBalance = await getBalance(user.address);
      await exchange
        .connect(user)
        .ethToTokenSwap(toWei(1.99), { value: toWei(1) });
      const userBalanceAfter = await getBalance(user.address);
      expect(fromWei(userBalanceAfter - userBalance)).to.eq(
        "-1.0000640179993313"
      );
      const userTokenBalance = await token.balanceOf(user.address);
      expect(fromWei(userTokenBalance)).to.eq("1.998001998001998001");

      const exchangeEthBalance = await getBalance(exchange.address);
      expect(fromWei(exchangeEthBalance)).to.equal("1001.0");

      const exchangeTokenBalance = await token.balanceOf(exchange.address);
      expect(fromWei(exchangeTokenBalance)).to.eq("1998.001998001998001999");
    });
    it("fails when output amount is less than min amount", async () => {
      await expect(exchange.connect(user).ethToTokenSwap(2), {
        value: toWei(1),
      }).to.be.revertedWith("insufficient output amount");
    });
    it("allows zero swaps", async function () {
      await exchange
        .connect(user)
        .ethToTokenSwap(toWei(0), { value: toWei(0) });
      const userTokenBalance = await token.balanceOf(user.address);
      expect(fromWei(userTokenBalance)).to.eq("0.0");

      const exchangeEthBalance = await getBalance(exchange.address);
      expect(fromWei(exchangeEthBalance)).to.equal("1000.0");

      const exchangeTokenBalance = await token.balanceOf(exchange.address);
      expect(fromWei(exchangeTokenBalance)).to.eq("2000.0");
    });
  });
  describe("tokenToEthSwap", async () => {
    beforeEach(async () => {
      await token.transfer(user.address, toWei(2));
      await token.connect(user).approve(exchange.address, toWei(2));

      await token.approve(exchange.address, toWei(2000));
      await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
    });

    it("transfers at least min amount of tokens", async () => {
      const userBalanceBefore = await getBalance(user.address);

      await exchange.connect(user).tokenToEthSwap(toWei(2), toWei(0.9));

      const userBalanceAfter = await getBalance(user.address);
      expect(fromWei(userBalanceAfter - userBalanceBefore)).to.equal(
        "0.9989516271235891"
      );

      const userTokenBalance = await token.balanceOf(user.address);
      expect(fromWei(userTokenBalance)).to.equal("0.0");

      const exchangeEthBalance = await getBalance(exchange.address);
      expect(fromWei(exchangeEthBalance)).to.equal("999.000999000999001");

      const exchangeTokenBalance = await token.balanceOf(exchange.address);
      expect(fromWei(exchangeTokenBalance)).to.equal("2002.0");
    });
    it("fails when output amount is less than amount", async () => {
      await expect(
        exchange.connect(user).tokenToEthSwap(toWei(2), toWei(1.0))
      ).to.be.revertedWith("insufficient output amount");
    });
    it("allows zero swaps", async () => {
      await exchange.connect(user).tokenToEthSwap(toWei(0), toWei(0));

      const userBalance = await getBalance(user.address);
      expect(fromWei(userBalance)).to.equal("9999.998600623351401775");

      const userTokenBalance = await token.balanceOf(user.address);
      expect(fromWei(userTokenBalance)).to.eq("2.0");

      const exchangeEthBalance = await getBalance(exchange.address);
      expect(fromWei(exchangeEthBalance)).to.equal("1000.0");

      const exchangeTokenBalance = await token.balanceOf(exchange.address);
      expect(fromWei(exchangeTokenBalance)).to.eq("2000.0");
    });
  });
});
