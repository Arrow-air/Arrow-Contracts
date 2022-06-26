const L2StandardTokenFactoryArtifact = require(`@eth-optimism/contracts/artifacts/contracts/L2/messaging/L2StandardTokenFactory.sol/L2StandardTokenFactory.json`);

const func = async (hre) => {
  const l1TokenAddress = process.env.L1_TOKEN_ADDRESS;

  if (l1TokenAddress === undefined) {
    console.log(`error: Undefined L1_TOKEN_ADDRESS environment variable. Please define an L1 Arrow token contract to be associated with this L2 token.`);
    return;
  }

  const l2TokenName = "Arrow Air";
  const l2TokenSymbol = "ARROW";

  // Instantiate the signer
  const provider = new ethers.providers.JsonRpcProvider(hre.network.config.url);
  const signer = new ethers.Wallet(process.env.DEPLOYMENT_PRIVATE_KEY, provider);

  const chainId = await web3.eth.getChainId();
  if (!(chainId === 69 || chainId === 10)) {
    console.log(`Not an Optimism network! Current chainID: ${chainId}`);
    return;
  }


  console.log(
    "Creating instance of L2StandardERC20 on",
    hre.network.name,
    "network"
  );
  // Instantiate the Standard token factory
  const l2StandardTokenFactory = new ethers.Contract(
    "0x4200000000000000000000000000000000000012",
    L2StandardTokenFactoryArtifact.abi,
    signer
  );

  const tx = await l2StandardTokenFactory.createStandardL2Token(
    l1TokenAddress,
    l2TokenName,
    l2TokenSymbol
  );
  const receipt = await tx.wait();
  const args = receipt.events.find(
    ({ event }) => event === "StandardL2TokenCreated"
  ).args;

  // Get the L2 token address from the emmited event and log
  const l2TokenAddress = args._l2Token;
  console.log("L2StandardERC20 deployed to:", l2TokenAddress);
}


func.tags = ["L2Token"];
module.exports = func;