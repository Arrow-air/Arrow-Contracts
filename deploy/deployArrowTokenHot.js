const { BigNumber } = require("ethers");
const { LedgerSigner } = require("@ethersproject/hardware-wallets");

// Optional ability to pull environment variables securely
// require("dotenv").config();

// This script deploys an arbitrary ERC-20 and then spins up a bathToken (permissioned admin entry) for it
const func = async (hre) => {
  // Note using both web3 and ethers here as an example. Could choose just one for simplicity, I recommend ethers
  const { deployments, getNamedAccounts, web3, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // ** Key Inputs to ERC-20 **
  const name = "Arrow Air";
  const symbol = "ARROW";
  const intialSupply = 1000; // Initial token supply minted to admin/deployer
  // const decimals = 18;
  const admin = deployer;
  // ***

  // *** Nonce Manager ***
  const baseNonce = web3.eth.getTransactionCount(
    deployer //deployer
  ); //HD deployer
  let nonceOffset = 0;
  function getNonce() {
    return baseNonce.then((nonce) => nonce + nonceOffset++);
  }

  //   const blockGasLimit = 9000000;
  const chain = await web3.eth.getChainId();
  console.log(
    "Deploying",
    name,
    "ERC20 to ChainId",
    chain,
    "with",
    deployer,
    "as admin."
  );

  const erc20Factory = await hre.ethers.getContractFactory("ArrowToken");
  let deployedERC20;
  await erc20Factory
    .deploy(web3.utils.toWei(intialSupply.toString()), name, symbol, {
      nonce: await getNonce(),
    })
    .then(async (r) => {
      console.log("\nDeployed " + name + " (" + symbol + ") here: * ", r.address, " * to ChainID", chain);
      console.log("Initial Supply in wei:", web3.utils.toWei(intialSupply.toString()));
      deployedERC20 = r.address;
    });
};

func.tags = ["ArrowERC20"];
module.exports = func;
