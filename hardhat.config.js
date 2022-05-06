require("@nomiclabs/hardhat-waffle");
//require("hardhat-typechain");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// help//

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "rinkeby",

  paths: {
    artifacts: "./src/artifacts",
  },

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEYS],
      saveDeployments: true,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.6.2",
      },
      {
        version: "0.8.0",
      },
    ],
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API,
  },
};
