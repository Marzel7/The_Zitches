// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
var sleep = require("sleep");
const { ethers } = hre;
const { network } = require("hardhat");

let token, vendor;

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("Token");
  token = await Token.deploy();

  const Vendor = await ethers.getContractFactory("Vendor");
  vendor = await Vendor.deploy(token.address);
  // Approve vendor to sell users tokens
  //await token.approve(vendor.address, ethers.utils.parseEther("2000"));

  console.log("Token deployed to:", token.address);
  console.log("Vendor deployed to:", vendor.address);

  await token.transfer(vendor.address, ethers.utils.parseEther("1000"));
  const balance = await token.balanceOf(vendor.address);
  console.log("vendor token balance - ", balance);

  const owner = await vendor.owner();
  console.log("owner of vendor contract - ", owner);

  saveFrontendFiles();
  // verify contracts

  //npx hardhat clean will clear `ENOENT: no such file or directory` error
  if (network.name == "rinkeby") {
    //wait for 60 seconds before verify
    await sleep.sleep(60);
    await hre.run("verify:verify", {
      // address: token.address,
      address: vendor.address,
      constructorArguments: [token.address],
    });
  }
}

function saveFrontendFiles() {
  const contractsDir = __dirname + "/../src/contracts";
  const abisDir = __dirname + "/../src/contracts/abis";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
    fs.mkdirSync(abisDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(
      {
        tokenAddr: token.address,
        vendorAddr: vendor.address,
      },
      undefined,
      2
    )
  );

  const TokenArt = artifacts.readArtifactSync("Token");
  const VendorArt = artifacts.readArtifactSync("Vendor");
  fs.writeFileSync(
    contractsDir + "/abis/Token.json",
    JSON.stringify(TokenArt, null, 2)
  );
  fs.writeFileSync(
    contractsDir + "/abis/Vendor.json",
    JSON.stringify(VendorArt, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
