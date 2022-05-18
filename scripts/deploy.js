// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
var sleep = require("sleep");
const { network } = require("hardhat");

let propstoreFactory, token, exchange;

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const ExchangeFactory = await ethers.getContractFactory("Exchange");
  exchange = await ExchangeFactory.deploy();

  const Token = await ethers.getContractFactory("Token");
  token = await Token.deploy("ZToken", "ZTK", 10000);

  console.log("token deployed to:", token.address);
  console.log("exchange deployed to:", exchange.address);
  saveFrontendFiles();
  // verify contracts

  //npx hardhat clean will clear `ENOENT: no such file or directory` error
  if (network.name == "rinkeby_alchemy") {
    //wait for 60 seconds before verify
    await sleep.sleep(30);
    await hre.run("verify:verify", {
      address: exchange.address,
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
        exchangeFactory: exchangeFactory.address,
      },
      undefined,
      2
    )
  );

  const ExchangeFactoryArtifacts = artifacts.readArtifactSync("Exchange");

  fs.writeFileSync(
    contractsDir + "/abis/ExchangeFactoryArtifacts.json",
    JSON.stringify(ExchangeFactoryArtifacts, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
