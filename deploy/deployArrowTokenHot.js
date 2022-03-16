const { ethers, upgrades, web3 } = require("hardhat");

// Optional ability to pull environment variables securely
// require("dotenv").config();

const contractName = "ArrowToken";
// This script deploys an arbitrary ERC-20 and then spins up a bathToken (permissioned admin entry) for it
async function main() {
  // Note using both web3 and ethers here as an example. Could choose just one for simplicity, I recommend ethers
  const deployer = await ethers.getSigner();

  // ** Key Inputs to ERC-20 **
  const name = "Arrow Air";
  const symbol = "ARROW";
  const intialSupply = 100_000_000; // Initial token supply minted to admin/deployer

  // *** Nonce Manager ***
  const baseNonce = web3.eth.getTransactionCount(
    deployer.address //deployer
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
    deployer.address,
    "as admin."
  );

  // deploy upgradeable contracts under OpenZepplin's instruction:
  // https://docs.openzeppelin.com/upgrades-plugins/1.x/hardhat-upgrades
  const Token = await ethers.getContractFactory(contractName);
  await upgrades
    .deployProxy(Token, [web3.utils.toWei(intialSupply.toString()), name, symbol], {
      kind: "uups",
      nonce: await getNonce(),
    })
    .then(async (r) => {
      console.log(
        "\nDeployed " + name + " (" + symbol + ") proxy contract here: * ",
        r.address,
        " * on ChainID",
        chain
      );
      console.log(
        "Initial Supply in wei:",
        web3.utils.toWei(intialSupply.toString())
      );
    });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
