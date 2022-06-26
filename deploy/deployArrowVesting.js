const { BigNumber } = require("ethers");
const { LedgerSigner } = require("@ethersproject/hardware-wallets");
const Chains = require("../utils/Chains")

const func = async (hre) => {
  // Note using both web3 and ethers here as an example. Could choose just one for simplicity, I recommend ethers
  const { deployments, upgrades, getNamedAccounts, web3, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const admin = deployer;

  const chain = await web3.eth.getChainId();

  console.log(
    "Deploying vesting contracts to ChainId",
    chain,
    "...",
  );

  // *** Nonce Manager ***
  const baseNonce = web3.eth.getTransactionCount(
    deployer //deployer
  ); //HD deployer
  let nonceOffset = 0;
  function getNonce() {
    return baseNonce.then((nonce) => nonce + nonceOffset++);
  }

  const vestingFactory = await hre.ethers.getContractFactory("ArrowVestingFactory");

  let deployedContract;

  await vestingFactory.deploy()
  .then(async (r) => {

    await r.deployed()

    console.log("Deployed ArrowVestingFactory at", r.address, "on ChainID", chain);

    deployedContract = r;
  })
  .then(async (r) => {

    // Only verify on chains that are supported by Etherscan.
    if (!Chains.hasOwnProperty(chain)) {
      return
    }

    // Wait for some confirmations to allow Etherscan to verify correctly.
    await deployedContract.deployTransaction.wait(6);

    console.log("Verifying " + deployedContract.address + " on Etherscan...");

    await hre.run("verify:verify", {
      address: deployedContract.address,
    });
  })
  .catch(async(r) => {
    console.log("WARNING: Could not verify contract. Check that contracts have been verified on Etherscan.\nReason: " + r.toString())
  });
};

func.tags = ["ArrowVesting"];
module.exports = func;