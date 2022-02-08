// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
var sleep = require("sleep");
const { network } = require("hardhat");

let staker, fundManager;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(network);

  console.log("Deploying contracts with the account:", deployer.address);

  const FundManager = await ethers.getContractFactory("FundManager");
  fundManager = await FundManager.deploy();

  const Staker = await ethers.getContractFactory("Staker");
  staker = await Staker.deploy(fundManager.address);

  console.log("Staker deployed to:", staker.address);
  console.log("FundManager deployed to:", fundManager.address);

  saveFrontendFiles();
  // verify contracts

  //npx hardhat clean will clear `ENOENT: no such file or directory` error
  if (network.name == "rinkeby") {
    //wait for 60 seconds before verify
    await sleep.sleep(90);
    await hre.run("verify:verify", {
      address: staker.address,
      FundManagerAddress: fundManager.address,
      constructorArguments: [fundManager.address],
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
        stakerAddr: staker.address,
        fundManagerAddr: fundManager.address,
      },
      undefined,
      2
    )
  );

  const StakerArt = artifacts.readArtifactSync("Staker");
  const FundManagerArt = artifacts.readArtifactSync("FundManager");
  fs.writeFileSync(
    contractsDir + "/abis/Staker.json",
    JSON.stringify(StakerArt, null, 2)
  );
  fs.writeFileSync(
    contractsDir + "/abis/FundManager.json",
    JSON.stringify(FundManagerArt, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
