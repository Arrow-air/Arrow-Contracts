const { expect, assert } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ArrowToken Minting", function () {
  let Token;
  let arrowToken;
  let amount;
  let owner;
  let signer1;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ArrowToken");
    [owner, signer1] = await ethers.getSigners();
    arrowToken = await upgrades.deployProxy(Token, [
      ethers.BigNumber.from(1_000_000),
    ]);
    amount = 1_000;
    await arrowToken.deployed();
  });

  it("Should mint tokens only by the owner", async function () {
    let amount_before = await arrowToken.balanceOf(owner.address);
    await arrowToken.connect(owner).issueNewTokens(owner.address, amount);
    let amount_after = await arrowToken.balanceOf(owner.address);
    expect(amount_after - amount_before).to.equal(amount);

    // no other accounts can mint if they are not owner
    await expect(
      arrowToken.connect(signer1).issueNewTokens(signer1.address, amount)
    ).to.be.reverted;
    expect(await arrowToken.balanceOf(signer1.address)).to.equal(0);
  });

  it("Should mint tokens only by the new owner", async function () {
    await arrowToken.transferOwnership(signer1.address);

    // old owner should not be able to mint tokens
    await expect(
      arrowToken.connect(owner).issueNewTokens(signer1.address, amount)
    ).to.be.reverted;

    let amount_before = await arrowToken.balanceOf(signer1.address);
    await arrowToken.connect(signer1).issueNewTokens(signer1.address, amount);
    let amount_after = await arrowToken.balanceOf(signer1.address);
    expect(amount_after - amount_before).to.equal(amount);
  });
});
