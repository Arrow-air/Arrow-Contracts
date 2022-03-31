require("dotenv").config();
require("hardhat-deploy");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@openzeppelin/hardhat-defender");


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {},
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: (process.env.DEPLOYMENT_PRIVATE_KEY === undefined) ? [] : [`${process.env.DEPLOYMENT_PRIVATE_KEY}`]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: (process.env.DEPLOYMENT_PRIVATE_KEY === undefined) ? [] : [`${process.env.DEPLOYMENT_PRIVATE_KEY}`]
    },
    optimismKovan: {
      url: "https://kovan.optimism.io/",
      // ovm: true, // NOTE: example of how you could use a custom compiler
      gasPrice: 10000,
      chainId: 69,
      // Account specifics for testing
      timeout: 40000,
    },
  },
  // Easy contract verification
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  defender: {
    apiKey: process.env.DEFENDER_TEAM_API_KEY,
    apiSecret: process.env.DEFENDER_TEAM_API_SECRET_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  paths: {},
};
