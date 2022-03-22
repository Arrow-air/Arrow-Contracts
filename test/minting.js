const chai = require("chai");
const { ethers } = require("hardhat");
const {solidity} = require("ethereum-waffle");
chai.use(solidity);
const {expect} = chai;

describe("ArrowToken Minting", function () {
  let Token;
  let arrowToken;
  let amount;
  let owner;
  let signer1;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ArrowToken");
    [owner, signer1] = await ethers.getSigners();
    let name = "Arrow Token";
    let symbol = "ARROW";
    arrowToken = await Token.deploy(
      ethers.BigNumber.from(1_000_000),
      name,
      symbol
    );
    amount = 1_000;
  });

  describe("Current Owner", function () {
    it("Should mint tokens only by the owner", async function () {
    let amount_before = await arrowToken.balanceOf(owner.address);
    await arrowToken.connect(owner).mint(owner.address, amount);
    let amount_after = await arrowToken.balanceOf(owner.address);
    expect(amount_after - amount_before).to.equal(amount);

    // no other accounts can mint if they are not owner
    await expect(arrowToken.connect(signer1).mint(signer1.address, amount)).to.be.reverted;
    expect(parseInt(ethers.utils.formatUnits(await arrowToken.balanceOf(signer1.address), 0))).to.equal(0);
  })
});


describe("Transfer Owner", function () {
  it("Should mint tokens only by the new owner", async function () {
  
    await arrowToken.connect(owner).transferOwnership(signer1.address);
     
    let amount_before = await arrowToken.balanceOf(signer1.address);
    await arrowToken.connect(signer1).mint(signer1.address, amount);
    let amount_after = await arrowToken.balanceOf(signer1.address);
    expect(amount_after - amount_before).to.equal(amount);
     // old owner should not be able to mint tokens
     await expect(arrowToken.connect(owner).mint(signer1.address, amount)).to.be.reverted; 
  });
});

});
