// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const toWei = (value) => ethers.utils.parseEther(value.toString());
  const fromWei = (value) =>
    ethers.utils.formatEther(
      typeof value === "string" ? value : value.toString()
    );

  await deploy("DYDX", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });

  const DYDX = await ethers.getContract("DYDX", deployer);

  await deploy("DEX", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [DYDX.address],
    log: true,
    waitConfirmations: 5,
  });

  const dex = await ethers.getContract("DEX", deployer);
  // paste in your front-end address here to get 10 DYDX on deploy:
  // await DYDX.transfer(
  //   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  //   "" + 10 * 10 ** 18
  // );

  let balance = await DYDX.balanceOf(dex.address);
  console.log("DEX balance", fromWei(balance));
  // // uncomment to init DEX on deploy:
  console.log(
    "Approving DEX (" + dex.Address + ") to take DYDX from main account..."
  );
  // // If you are going to the testnet make sure your deployer account has enough ETH
  await DYDX.approve(dex.address, ethers.utils.parseEther("100"));
  console.log("INIT exchange...");
  await dex.init(ethers.utils.parseEther("5"), {
    value: ethers.utils.parseEther("5"),
    gasLimit: 200000,
  });

  balance = await DYDX.balanceOf(dex.address);
  console.log("DEX balance", fromWei(balance));
};

module.exports.tags = ["DYDX", "DEX"];
