const { BigNumber } = require("ethers");
const { LedgerSigner } = require("@ethersproject/hardware-wallets");
const Chains = require("../utils/Chains")

// This script deploys the Arrow Token contract and verifies the contract
// if the target blockchain is supported by Etherscan
const func = async (hre) => {
  // Note using both web3 and ethers here as an example. Could choose just one for simplicity, I recommend ethers
  const { deployments, upgrades, getNamedAccounts, web3, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // ** Key Inputs to ERC-20 **
  const name = "Arrow Air";
  const symbol = "ARROW";
  const initialSupply = 100_000_000; // Initial token supply minted to admin/deployer
  const initialSupplyWei = web3.utils.toWei(initialSupply.toString())
  const admin = deployer;

  const chain = await web3.eth.getChainId();

  console.log(
    "Deploying",
    name,
    "ERC20 to ChainId",
    chain,
    "with",
    deployer,
    "as admin..."
  );

  // *** Nonce Manager ***
  const baseNonce = web3.eth.getTransactionCount(
    deployer //deployer
  ); //HD deployer
  let nonceOffset = 0;
  function getNonce() {
    return baseNonce.then((nonce) => nonce + nonceOffset++);
  }

  const erc20Factory = await hre.ethers.getContractFactory("ArrowToken");

  let deployedContract;

  await upgrades.deployProxy(
    erc20Factory,
    [
      initialSupplyWei,
      name,
      symbol,
    ],
    {
      kind: "uups",
      nonce: await getNonce(),
    }
  )
  .then(async (r) => {

    await r.deployed()

    console.log("Deployed " + name + " (" + symbol + ") at", r.address, "on ChainID", chain);
    console.log("Initial Supply:", initialSupply);
    
    deployedContract = r;
  })
  .then(async (r) => {

    // Only verify on chains that are supported by Etherscan.
    if (!Chains.hasOwnProperty(chain)) {
      return
    }

    // Wait for some confirmations to allow Etherscan to verify correctly.
    await deployedContract.deployTransaction.wait(6);

    const implementation = await upgrades.erc1967.getImplementationAddress(deployedContract.address);

    console.log("Verifying " + deployedContract.address + " implementation (" + implementation + ") on Etherscan...");

    await hre.run("verify:verify", {
      address: implementation,
    });
  })
  .catch(async(r) => {
    console.log("WARNING: Could not verify contract. Check that contracts have been verified on Etherscan.\nReason: " + r.toString())
  });
};

func.tags = ["ArrowERC20", "Deployment"];
module.exports = func;