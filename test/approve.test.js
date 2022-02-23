const { expect, assert } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ArrowToken Approve", function () {
  let Token;
  let arrowToken;
  let owner;
  let signer1;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ArrowToken");
    [owner, signer1] = await ethers.getSigners();
    arrowToken = await upgrades.deployProxy(Token, [
      ethers.BigNumber.from(1_000_000),
    ]);
    await arrowToken.deployed();
  });

  it("Should have an initial allowance of zero", async function () {
    assert.strictEqual(
      await arrowToken.allowance(owner.address, signer1.address),
      0
    );
  });

  it("Spender should have the correct allowance", async function () {
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(1_000));
    assert.strictEqual(
      await arrowToken.allowance(owner.address, signer1.address),
      1_000
    );
  });

  it("Should have the correct allowance after modifications", async function () {
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(1_000));
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(100));
    assert.strictEqual(
      await arrowToken.allowance(owner.address, signer1.address),
      100
    );
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(10));
    assert.strictEqual(
      await arrowToken.allowance(owner.address, signer1.address),
      10
    );
  });

  it("Should have zero allowance when revoked", async function () {
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(1_000));
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(0));
    assert.strictEqual(
      await arrowToken.allowance(owner.address, signer1.address),
      0
    );
  });

  it("Should be able to approve self", async function () {
    await arrowToken
      .connect(owner)
      .approve(owner.address, ethers.BigNumber.from(1_000));
    assert.strictEqual(
      await arrowToken.allowance(owner.address, owner.address),
      1_000
    );
  });

  it("Should only affect target", async function () {
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(1_000));
    assert.strictEqual(
      await arrowToken.allowance(signer1.address, owner.address),
      0
    );
  });

  it("Should emit event", async function () {
    await expect(
      arrowToken.approve(signer1.address, ethers.BigNumber.from(1_000))
    )
      .to.emit(arrowToken, "Approval")
      .withArgs(owner.address, signer1.address, 1_000);
  });
});
