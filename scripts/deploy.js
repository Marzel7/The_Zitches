// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs');
var sleep = require('sleep');
const { network } = require("hardhat");


let simpleStorage, greeter

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  simpleStorage = await SimpleStorage.deploy();

  const Greeter = await ethers.getContractFactory("Greeter")
  greeter = await Greeter.deploy('Welcome, ser')

  console.log("SimpleStorage deployed to:", simpleStorage.address);
  console.log("Greeter deployed to:", greeter.address);

  saveFrontendFiles()
  // verify contracts

  //npx hardhat clean will clear `ENOENT: no such file or directory` error
  if(network.name != "hardhat") {
     //wait for 60 seconds before verify
    await sleep.sleep(60)
    await hre.run("verify:verify", {
        simpleStorageAddress: simpleStorage.address,
        greeterAddress: greeter.address,
        constructorArguments: [],
    })
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
    JSON.stringify({
        simpleStorageAddr: simpleStorage.address,
        greeterAddr: greeter.address,
      }, undefined, 2)
  );

  const SimpleStorageArt = artifacts.readArtifactSync("SimpleStorage");
  const GreeterArt = artifacts.readArtifactSync("Greeter");
  fs.writeFileSync(contractsDir + "/abis/SimpleStorage.json",JSON.stringify(SimpleStorageArt, null, 2));
  fs.writeFileSync(contractsDir + "/abis/Greeter.json",JSON.stringify(GreeterArt, null, 2));


}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });