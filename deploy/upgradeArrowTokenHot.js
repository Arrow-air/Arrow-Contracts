
const func = async (hre) => {
  const { deployments, upgrades, getNamedAccounts, ethers } = hre;

  const proxyAddress = process.env.ARROW_TOKEN_PROXY_CONTRACT;
  const multisigAddress = process.env.ARROW_TOKEN_MUTISIG;

  if (proxyAddress === undefined) {
    console.log("error: Undefined ARROW_TOKEN_PROXY_CONTRACT environment variable. Please define with the Arrow token proxy contract that should have it's implementation upgraded.");
    process.exit(1);
  }

  if (multisigAddress === undefined) {
    console.log("error: Undefined ARROW_TOKEN_MUTISIG environment variable. Please define with the Gnosis multisig address that holds ownership of the Arrow token contract.");
    process.exit(1);
  }

  const erc20Factory = await hre.ethers.getContractFactory("ArrowToken");
  const oldToken = erc20Factory.attach(proxyAddress)

  console.log("Upgrading " + await oldToken.name() + "...")

  const proposal = await defender.proposeUpgrade(proxyAddress, erc20Factory, {
    multisig: multisigAddress,
    multisigType: "Gnosis Safe",
    title: "Upgrade ArrowToken",
  });
  
  console.log("Upgrade proposal created at:", proposal.url);
}

func.tags = ["ArrowERC20", "Upgrade"];
module.exports = func;