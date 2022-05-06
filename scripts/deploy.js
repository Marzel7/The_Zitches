// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
var sleep = require("sleep");
const { network } = require("hardhat");

let propstoreFactory;

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const PropStoreFactory = await ethers.getContractFactory("PropStoreFactory");
  propstoreFactory = await PropStoreFactory.deploy();

  console.log("propstoreFactory deployed to:", propstoreFactory.address);
  saveFrontendFiles();
  // verify contracts

  //npx hardhat clean will clear `ENOENT: no such file or directory` error
  if (network.name == "rinkeby") {
    //wait for 60 seconds before verify
    await sleep.sleep(60);
    await hre.run("verify:verify", {
      propstoreFactoryAddress: propstoreFactory.address,
      constructorArguments: [],
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
        propstoreFactoryAddress: propstoreFactory.address,
      },
      undefined,
      2
    )
  );

  const PropstoreFactoryArtifacts =
    artifacts.readArtifactSync("PropStoreFactory");

  fs.writeFileSync(
    contractsDir + "/abis/PropstoreFactoryArtifacts.json",
    JSON.stringify(PropstoreFactoryArtifacts, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
