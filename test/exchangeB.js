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

    const Exchange = await ethers.getContractFactory("ExchangeB");
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
  describe("add liquidity", async () => {
    describe("empty reserves", async () => {
      it("adds liquidity", async () => {
        await token.approve(exchange.address, toWei(200));
        await exchange.addLiquidity(toWei(200), { value: toWei(100) });

        expect(await getBalance(exchange.address)).to.eq(toWei(100));
        expect(await exchange.getReserve()).to.eq(toWei(200));
      });
      it("mints lp tokens", async () => {
        await token.approve(exchange.address, toWei(200));
        await exchange.addLiquidity(toWei(200), { value: toWei(100) });

        expect(await exchange.balanceOf(owner.address)).to.equal(toWei(100));
        expect(await exchange.totalSupply()).to.eq(toWei(100));
      });
      it("allows zero amount", async () => {
        await token.approve(exchange.address, 0);
        await exchange.addLiquidity(0, { value: 0 });

        expect(await getBalance(exchange.address)).to.eq(0);
        expect(await exchange.getReserve()).to.eq(0);
      });
    });
    describe("exsisting reserves", async () => {
      beforeEach(async () => {
        await token.approve(exchange.address, toWei(300));
        await exchange.addLiquidity(toWei(200), { value: toWei(100) });
      });
      it("preserves exchange rate", async () => {
        await exchange.addLiquidity(toWei(200), { value: toWei(50) });

        expect(await getBalance(exchange.address)).to.eq(toWei(150));
        expect(await exchange.getReserve()).to.eq(toWei(300));
      });
      it("mints lp tokens", async () => {
        await exchange.addLiquidity(toWei(200), { value: toWei(50) });

        expect(await exchange.balanceOf(owner.address)).to.eq(toWei(150));
        expect(await exchange.totalSupply()).to.eq(toWei(150));
        expect(await exchange.getReserve()).to.eq(toWei(300));
      });
      it("fails when not enough tokens", async () => {
        await expect(
          exchange.addLiquidity(toWei(50), { value: toWei(50) })
        ).to.be.revertedWith("insufficient token amount");
      });
    });

    describe("removing liquidity", async () => {
      beforeEach(async () => {
        await token.approve(exchange.address, toWei(300));
        await exchange.addLiquidity(toWei(200), { value: toWei(100) });
      });

      it("removes some liquidity", async () => {
        const userEtherBalanceBefore = await getBalance(owner.address);
        const userTokenBalanceBefore = await token.balanceOf(owner.address);

        await exchange.removeLiquidity(toWei(25));

        expect(await exchange.getReserve()).to.equal(toWei(150));
        expect(await getBalance(exchange.address)).to.equal(toWei(75));

        const userEtherBalanceAfter = await getBalance(owner.address);
        const userTokenBalanceAfter = await token.balanceOf(owner.address);

        expect(
          fromWei(userEtherBalanceAfter.sub(userEtherBalanceBefore))
        ).to.equal("24.999935355908984756"); // 25 - gas fees

        expect(
          fromWei(userTokenBalanceAfter.sub(userTokenBalanceBefore))
        ).to.eq("50.0");
      });

      it("removes all liquidity", async () => {
        const userEtherBalanceBefore = await getBalance(owner.address);
        const userTokenBalanceBefore = await token.balanceOf(owner.address);

        await exchange.removeLiquidity(toWei(100));

        expect(await exchange.getReserve()).to.eq(toWei(0));
        expect(await getBalance(exchange.address)).to.eq(0);

        const userEtherBalanceAfter = await getBalance(owner.address);
        const userTokenBalanceAfter = await token.balanceOf(owner.address);

        expect(
          fromWei(userEtherBalanceAfter.sub(userEtherBalanceBefore))
        ).to.eq("99.999948630793701382");
        expect(
          fromWei(userTokenBalanceAfter.sub(userTokenBalanceBefore))
        ).to.eq("200.0");
      });

      it("pays for provided liquidity", async () => {
        const userEtherBalanceBefore = await getBalance(owner.address);
        const userTokenBalanceBefore = await token.balanceOf(owner.address);

        await exchange
          .connect(user)
          .ethToTokenSwap(toWei(18), { value: toWei(10) });

        await exchange.removeLiquidity(toWei(100));
        expect(await exchange.getReserve()).to.eq(toWei(0));
        expect(await getBalance(exchange.address)).to.eq(toWei(0));
        expect(fromWei(await token.balanceOf(user.address))).to.equal(
          "18.01637852593266606"
        );

        const userEtherBalanceAfter = await getBalance(owner.address);
        const userTokenBalanceAfter = await token.balanceOf(owner.address);

        expect(
          fromWei(userEtherBalanceAfter.sub(userEtherBalanceBefore))
        ).to.eq("109.999948841915558783"); // 110 - gas fees

        expect(
          fromWei(userTokenBalanceAfter.sub(userTokenBalanceBefore))
        ).to.eq("181.98362147406733394");
      });

      it("burns LP-tokens", async () => {
        await expect(() =>
          exchange.removeLiquidity(toWei(25))
        ).to.changeTokenBalance(exchange, owner, toWei(-25));

        expect(await exchange.totalSupply()).to.equal(toWei(75));
      });

      it("doesnt allow an invalid amount", async () => {
        await expect(exchange.removeLiquidity(toWei(100.1))).to.be.revertedWith(
          "burn amount exceeds balance"
        );
      });
    });

    describe("getTokenAmount", async () => {
      it("returns correct token amount", async () => {
        await token.approve(exchange.address, toWei(2000));
        await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });

        let tokensOut = await exchange.getTokenAmount(toWei(1));
        expect(fromWei(tokensOut)).to.eq("1.978041738678708079");

        tokensOut = await exchange.getTokenAmount(toWei(100));
        expect(fromWei(tokensOut)).to.eq("180.1637852593266606");

        tokensOut = await exchange.getTokenAmount(toWei(1000));
        expect(fromWei(tokensOut)).to.eq("994.974874371859296482");
      });
    });

    describe("getEthAmount", async () => {
      it("returns correct ether amount", async () => {
        await token.approve(exchange.address, toWei(2000));
        await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });

        let ethOut = await exchange.getEthAmount(toWei(2));
        expect(fromWei(ethOut)).to.equal("0.989020869339354039");

        ethOut = await exchange.getEthAmount(toWei(100));
        expect(fromWei(ethOut)).to.equal("47.16531681753215817");

        ethOut = await exchange.getEthAmount(toWei(2000));
        expect(fromWei(ethOut)).to.equal("497.487437185929648241");
      });
    });

    describe("ethToTokenSwap", async () => {
      beforeEach(async () => {
        await token.approve(exchange.address, toWei(2000));
        await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
      });

      it("transfers at least min amount of tokens", async () => {
        const userBalanceBefore = await getBalance(user.address);
        await exchange
          .connect(user)
          .ethToTokenSwap(toWei(1.97), { value: toWei(1) });

        const userBalanceAfter = await getBalance(user.address);
        expect(fromWei(userBalanceAfter.sub(userBalanceBefore))).to.eq(
          "-1.000061400576129844"
        );

        const exchangeEthBalance = await getBalance(exchange.address);
        expect(fromWei(exchangeEthBalance)).to.eq("1001.0");

        const exchangeTokenBalance = await token.balanceOf(exchange.address);
        expect(fromWei(exchangeTokenBalance)).to.eq("1998.021958261321291921");
      });

      it("effects exchange rate", async () => {
        let tokensOut = await exchange.getTokenAmount(toWei(10));
        expect(fromWei(tokensOut)).to.equal("19.605901574413308248");

        await exchange
          .connect(user)
          .ethToTokenSwap(toWei(19), { value: toWei(10) });

        tokensOut = await exchange.getTokenAmount(toWei(10));
        expect(fromWei(tokensOut)).to.equal("19.223356774598792281");
      });

      it("fails when output amount is less than minimum amount", async () => {
        await expect(
          exchange.connect(user).ethToTokenSwap(toWei(2), { value: 1 })
        ).to.be.revertedWith("insufficient output amount");
      });

      it("allows zero swaps", async () => {
        await exchange
          .connect(user)
          .ethToTokenSwap(toWei(0), { value: toWei(0) });
        const userTokenBalance = await token.balanceOf(user.address);
        expect(fromWei(userTokenBalance)).to.equal("0.0");

        const exchangeEthBalance = await getBalance(exchange.address);
        expect(fromWei(exchangeEthBalance)).to.equal("1000.0");

        const exchangeTokenBalance = await token.balanceOf(exchange.address);
        expect(fromWei(exchangeTokenBalance)).to.equal("2000.0");
      });
    });

    describe("tokenToEthSwap", async () => {
      beforeEach(async () => {
        await token.transfer(user.address, toWei(22));
        await token.connect(user).approve(exchange.address, toWei(22));

        await token.approve(exchange.address, toWei(2000));
        await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
      });

      it("transfers at least minimum number of tokens", async () => {
        const userBalanceBefore = await getBalance(user.address);
        const exchangeBalanceBefore = await getBalance(exchange.address);

        await exchange.connect(user).tokenToEthSwap(toWei(2), toWei(0.9));

        const userBalanceAfer = await getBalance(user.address);

        expect(fromWei(userBalanceAfer.sub(userBalanceBefore))).to.eq(
          "0.988961674586110389"
        );

        const userTokenBalance = await token.balanceOf(user.address);
        expect(userTokenBalance).to.eq(toWei("20"));

        const exchangeBalanceAfter = await getBalance(exchange.address);
        expect(fromWei(exchangeBalanceAfter.sub(exchangeBalanceBefore))).to.eq(
          "-0.989020869339354039"
        );

        const exchangeTokenBalance = await token.balanceOf(exchange.address);
        expect(fromWei(exchangeTokenBalance)).to.eq("2002.0");
      });

      it("affects exchange rate", async () => {
        let ethOut = await exchange.getEthAmount(toWei(20));
        expect(fromWei(ethOut)).to.equal("9.802950787206654124");

        await exchange.connect(user).tokenToEthSwap(toWei(20), toWei(9));
        ethOut = await exchange.getEthAmount(toWei(20));
        expect(fromWei(ethOut)).to.eq("9.61167838729939614");
      });

      it("fails when output amount is less than min amount", async () => {
        await expect(
          exchange.connect(user).tokenToEthSwap(toWei(2), toWei(1.0))
        ).to.be.revertedWith("insufficient output amount");
      });
    });

    describe("zero swaps", async () => {
      beforeEach(async () => {
        await token.transfer(user.address, toWei(22));
        await token.approve(exchange.address, toWei(2000));
        await exchange.addLiquidity(toWei(100), { value: toWei(100) });
      });

      it("allows zero swaps", async () => {
        const userBalanceBefore = await getBalance(user.address);
        await exchange.connect(user).tokenToEthSwap(toWei(0), toWei(0));
        const userBalanceAfter = await getBalance(user.address);
        expect(fromWei(userBalanceAfter.sub(userBalanceBefore))).to.eq(
          "-0.0000439500438621"
        );
        const userTokenBalance = await token.balanceOf(user.address);
        expect(fromWei(userTokenBalance)).to.equal("22.0");

        const exchangeEthBalance = await getBalance(exchange.address);
        expect(fromWei(exchangeEthBalance)).to.equal("100.0");

        const exchangeTokenBalance = await token.balanceOf(exchange.address);
        expect(fromWei(exchangeTokenBalance)).to.equal("100.0");
      });
    });
  });
});
