require("dotenv").config();
require("hardhat-deploy");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  paths: {},
  solidity: {
    version: "0.8.11",
    // overrides: {
    //   "@openzeppelin": "OpenZeppelin/openzeppelin-contracts@4.4.1",
    //   "@openzeppelin-upgradeable":
    //     "OpenZeppelin/openzeppelin-contracts-upgradeable@4.4.1",
    // },
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },

  networks: {
    optimismKovan: {
      url: "https://kovan.optimism.io/",
      // ovm: true, // NOTE: example of how you could use a custom compiler
      gasPrice: 1000000,
      chainId: 69,
      // Account specifics for testing
      accounts: [
        process.env.ADMIN_KEY,
        // process.env.PROXY_ADMIN_KEY,
      ],
      timeout: 40000,
    },
  },
  // Easy contract verification
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    // apiKey: process.env.ETHERSCAN_API,
    apiKey: process.env.ETHERSCAN_API_OPTIMISM,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
