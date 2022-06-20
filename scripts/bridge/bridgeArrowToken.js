/*
 This script sents L1 ARROW tokens to an L1 standard bridge,
 which would release an equal amount of ARROW tokens on L2.

 Modified from Optimism's tutorial script: 
 https://github.com/ethereum-optimism/optimism-tutorial/blob/main/cross-dom-bridge/index.js


 IMPORTANT: to test bridging, make sure you deploy L1 token contracts on the Ethereum Kovan testnet as Rinkeby is not supported at the moment
 */

const ethers = require("ethers")
const optimismSDK = require("@eth-optimism/sdk")
require('dotenv').config()
const gwei = 1000000000n
const eth = gwei * gwei   // 10^18

// ------!!!------
// Don't forget to change these accordingly
const l1Url = `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
const l2Url = "https://kovan.optimism.io/"
const l1ChainId = 42 // eth kovan; Rinkeby is not supported by OP for now
const amountToDeposit = 100_000_000n * eth 
const amountToWithDraw = 100_000_000n * eth


const tokenAddrs = {
    l1Addr: process.env.L1_TOKEN_ADDRESS,
    l2Addr: process.env.L2_TOKEN_ADDRESS
}  

// Global variable because we need them almost everywhere
let crossChainMessenger
let l1ERC20, l2ERC20    // ARROW contracts to show ERC-20 transfers
let addr    // Deployer's address

const getSigners = async () => {
    const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)    
    const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)
    
    const privateKey = process.env.DEPLOYMENT_PRIVATE_KEY

    const l1Wallet = new ethers.Wallet(privateKey, l1RpcProvider)
    const l2Wallet = new ethers.Wallet(privateKey, l2RpcProvider)

    return [l1Wallet, l2Wallet]
}  

const setup = async() => {
    const [l1Signer, l2Signer] = await getSigners()
    addr = l1Signer.address
    crossChainMessenger = new optimismSDK.CrossChainMessenger({
        l1ChainId: l1ChainId,  
        l1SignerOrProvider: l1Signer,
        l2SignerOrProvider: l2Signer
    })
    l1ERC20 = new ethers.Contract(tokenAddrs.l1Addr, erc20ABI, l1Signer)
    l2ERC20 = new ethers.Contract(tokenAddrs.l2Addr, erc20ABI, l2Signer)  
  }    // setup

// The ABI fragment for an ERC20 we need to get a user's balance.
const erc20ABI = [  
    // balanceOf
    {    
      constant: true,  
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
  ]    // erc20ABI





const reportERC20Balances = async () => {
    const l1Balance = (await l1ERC20.balanceOf(addr)).toString().slice(0,-18)
    const l2Balance = (await l2ERC20.balanceOf(addr)).toString().slice(0,-18)
    console.log(`ARROW balance on L1:${l1Balance}    ARROW balance on L2:${l2Balance}`)  
}    // reportERC20Balances



const depositERC20 = async () => {

    console.log("Depositing ERC20")
    await reportERC20Balances()
    const start = new Date()
  
    // Need the l2 address to know which bridge is responsible
    const allowanceResponse = await crossChainMessenger.approveERC20(
      tokenAddrs.l1Addr, tokenAddrs.l2Addr, amountToDeposit)
    await allowanceResponse.wait()

    console.log(`Allowance given by tx ${allowanceResponse.hash}`)
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)
  
    const response = await crossChainMessenger.depositERC20(
      tokenAddrs.l1Addr, tokenAddrs.l2Addr, amountToDeposit)
    console.log(`Deposit transaction hash (on L1): ${response.hash}`)
    await response.wait()
    console.log("Waiting for status to change to RELAYED")
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)  
    await crossChainMessenger.waitForMessageStatus(response.hash, 
                                                    optimismSDK.MessageStatus.RELAYED) 
  
    await reportERC20Balances()    
    console.log(`depositERC20 took ${(new Date()-start)/1000} seconds\n\n`)
  }     // depositERC20()

  const withdrawERC20 = async () => { 
  
    console.log("Withdraw ERC20")
    const start = new Date()  
    await reportERC20Balances()
  
    const response = await crossChainMessenger.withdrawERC20(
      tokenAddrs.l1Addr, tokenAddrs.l2Addr, amountToWithDraw)
    console.log(`Transaction hash (on L2): ${response.hash}`)
    await response.wait()
  
    console.log("Waiting for status to change to IN_CHALLENGE_PERIOD")
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)
    await crossChainMessenger.waitForMessageStatus(response.hash, 
      optimismSDK.MessageStatus.IN_CHALLENGE_PERIOD)
    console.log("In the challenge period, waiting for status READY_FOR_RELAY") 
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)  
    await crossChainMessenger.waitForMessageStatus(response.hash, 
                                                  optimismSDK.MessageStatus.READY_FOR_RELAY) 
    console.log("Ready for relay, finalizing message now")
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)  
    await crossChainMessenger.finalizeMessage(response)
    console.log("Waiting for status to change to RELAYED")
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)  
    await crossChainMessenger.waitForMessageStatus(response, 
      optimismSDK.MessageStatus.RELAYED)
    await reportERC20Balances()   
    console.log(`withdrawERC20 took ${(new Date()-start)/1000} seconds\n\n\n`)  
  }     // withdrawERC20()



const main = async () => {    
    await setup()
    if (process.argv[2] === "deposit") {
      await depositERC20()   
    } 
    if (process.argv[2] === "withdraw") {
      await withdrawERC20()  
    } 
}  // main



main().then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })