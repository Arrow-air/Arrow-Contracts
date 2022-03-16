const { assert } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ArrowToken Approve", function () {
  let Token;
  let arrowToken;
  let owner;
  let signer1;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ArrowToken");
    [owner, signer1] = await ethers.getSigners();
    let name = "Arrow Token";
    let symbol = "ARROW";
    arrowToken = await upgrades.deployProxy(
      Token,
      [ethers.BigNumber.from(1_000_000), name, symbol],
      { kind: "uups" }
    );
  });

  it("Should have an initial allowance of zero", async function () {
    assert.strictEqual(
      parseInt(ethers.utils.formatUnits(await arrowToken.allowance(owner.address, signer1.address), 0)),
      0
    );
  });

  it("Spender should have the correct allowance", async function () {
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(1_000));
    assert.strictEqual(
      parseInt(ethers.utils.formatUnits(await arrowToken.allowance(owner.address, signer1.address), 0)),
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
      parseInt(ethers.utils.formatUnits(await arrowToken.allowance(owner.address, signer1.address), 0)),
      100
    );
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(10));
    assert.strictEqual(
      parseInt(ethers.utils.formatUnits(await arrowToken.allowance(owner.address, signer1.address), 0)),
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
      parseInt(ethers.utils.formatUnits(await arrowToken.allowance(owner.address, signer1.address), 0)),
      0
    );
  });

  it("Should be able to approve self", async function () {
    await arrowToken
      .connect(owner)
      .approve(owner.address, ethers.BigNumber.from(1_000));
    assert.strictEqual(
      parseInt(ethers.utils.formatUnits(await arrowToken.allowance(owner.address, owner.address), 0)),
      1_000
    );
  });

  it("Should only affect target", async function () {
    await arrowToken
      .connect(owner)
      .approve(signer1.address, ethers.BigNumber.from(1_000));
    assert.strictEqual(
      parseInt(ethers.utils.formatUnits(await arrowToken.allowance(signer1.address, owner.address), 0)),
      0
    );
  });

});
