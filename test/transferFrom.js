const { expect, assert } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ArrowToken TransferFrom", function () {
  let Token;
  let arrowToken;
  let owner;
  let signer1;
  let signer2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ArrowToken");
    [owner, signer1, signer2] = await ethers.getSigners();
    let name = "Arrow Token";
    let symbol = "ARROW";
    arrowToken = await Token.deploy(
      ethers.BigNumber.from(1_000_000),
      name,
      symbol
    );
    await arrowToken.deployed();
  });

  it("Should decrease sender's balance", async function () {
    let senderBalance = await arrowToken.balanceOf(owner.address);
    let amount = senderBalance;

    await arrowToken.approve(signer1.address, amount);
    await arrowToken
      .connect(signer1)
      .transferFrom(owner.address, signer2.address, amount);
    expect(await arrowToken.balanceOf(owner.address)).to.equal(
      senderBalance - amount
    );
  });

  it("Should increase receiver's balance", async function () {
    let receiverBalance = await arrowToken.balanceOf(signer2.address);
    let amount = await arrowToken.balanceOf(owner.address);

    await arrowToken.approve(signer1.address, amount);
    await arrowToken
      .connect(signer1)
      .transferFrom(owner.address, signer2.address, amount);
    expect(await arrowToken.balanceOf(signer2.address)).to.equal(
      receiverBalance + amount
    );
  });

  it("Should not affect caller balance", async function () {
    let callerBalance = await arrowToken.balanceOf(signer1.address);
    let amount = await arrowToken.balanceOf(owner.address);

    await arrowToken.approve(signer1.address, amount);
    await arrowToken
      .connect(signer1)
      .transferFrom(owner.address, signer2.address, amount);
    expect(await arrowToken.balanceOf(signer1.address)).to.equal(callerBalance);
  });

  it("Should affect caller's allowance with owner approval", async function () {
    let approvalAmount = await arrowToken.balanceOf(owner.address);
    let transferAmount = approvalAmount;

    await arrowToken.approve(signer1.address, approvalAmount);
    await arrowToken
      .connect(signer1)
      .transferFrom(owner.address, signer2.address, transferAmount);

    expect(await arrowToken.allowance(owner.address, signer1.address)).to.equal(
      approvalAmount - transferAmount
    );
  });

  it("Should not affect receiver's allowance with owner approval", async function () {
    let approvalAmount = await arrowToken.balanceOf(owner.address);
    let transferAmount = approvalAmount;

    await arrowToken.approve(signer1.address, approvalAmount);
    await arrowToken.approve(signer2.address, approvalAmount);
    await arrowToken
      .connect(signer1)
      .transferFrom(owner.address, signer2.address, transferAmount);

    expect(await arrowToken.allowance(owner.address, signer2.address)).to.equal(
      approvalAmount
    );
  });

  it("Should not affect the total supply of tokens", async function () {
    let totalSupply = await arrowToken.totalSupply();
    let amount = await arrowToken.balanceOf(owner.address);

    await arrowToken.approve(signer1.address, amount);
    await arrowToken
      .connect(signer1)
      .transferFrom(owner.address, signer2.address, amount);

    expect(await arrowToken.totalSupply()).to.equal(totalSupply);
  });

  it("Should correctly transfer the full balance", async function () {
    let amount = await arrowToken.balanceOf(owner.address);
    let receiverBalance = await arrowToken.balanceOf(signer2.address);

    await arrowToken.approve(signer1.address, amount);
    await arrowToken
      .connect(signer1)
      .transferFrom(owner.address, signer2.address, amount);

    expect(await arrowToken.balanceOf(signer2.address)).to.equal(
      receiverBalance + amount
    );
    expect(await arrowToken.balanceOf(owner.address)).to.equal(0);
  });

  it("Should correctly transfer zero token", async function () {
    let senderBalance = await arrowToken.balanceOf(owner.address);
    let receiverBalance = await arrowToken.balanceOf(signer2.address);

    await arrowToken.approve(signer1.address, senderBalance);
    await arrowToken
      .connect(signer1)
      .transferFrom(owner.address, signer2.address, 0);

    expect(await arrowToken.balanceOf(owner.address)).to.equal(senderBalance);
    expect(await arrowToken.balanceOf(signer2.address)).to.equal(
      receiverBalance
    );
  });

  it("Should correctly transfer zero token without approval", async function () {
    let senderBalance = await arrowToken.balanceOf(owner.address);
    let receiverBalance = await arrowToken.balanceOf(signer2.address);

    await arrowToken
      .connect(signer1)
      .transferFrom(owner.address, signer2.address, 0);

    expect(await arrowToken.balanceOf(owner.address)).to.equal(senderBalance);
    expect(await arrowToken.balanceOf(signer2.address)).to.equal(
      receiverBalance
    );
  });

  it("Should revert when there's insufficient balance", async function () {
    let amount = await arrowToken.balanceOf(owner.address);

    await arrowToken.approve(signer1.address, amount + 1);

    await expect(
      arrowToken
        .connect(signer1)
        .transferFrom(owner.address, signer2.address, amount + 1)
    ).to.be.reverted;
  });

  it("Should revert on unapproved transfers", async function () {
    let amount = await arrowToken.balanceOf(owner.address);

    await expect(
      arrowToken
        .connect(signer1)
        .transferFrom(owner.address, signer2.address, amount)
    ).to.be.reverted;
  });

  it("Should revert on revoked approval transfers", async function () {
    let amount = await arrowToken.balanceOf(owner.address);

    await arrowToken.approve(signer1.address, amount);
    await arrowToken.approve(signer1.address, 0);

    await expect(
      arrowToken
        .connect(signer1)
        .transferFrom(owner.address, signer2.address, amount)
    ).to.be.reverted;
  });

  it("Should correctly transfer to self", async function () {
    let senderBalance = await arrowToken.balanceOf(owner.address);
    let amount = senderBalance;

    await arrowToken.approve(owner.address, senderBalance);
    await arrowToken.transferFrom(owner.address, owner.address, amount);

    expect(await arrowToken.balanceOf(owner.address)).to.equal(senderBalance);
    expect(await arrowToken.allowance(owner.address, owner.address)).to.equal(
      senderBalance - amount
    );
  });

  it("Should revert when transfering to self without approval", async function () {
    let senderBalance = await arrowToken.balanceOf(owner.address);
    let amount = senderBalance;

    await expect(arrowToken.transferFrom(owner.address, owner.address, amount))
      .to.be.reverted;
  });

  it("Should emit event", async function () {
    let amount = await arrowToken.balanceOf(owner.address);

    await arrowToken.approve(signer1.address, amount);

    expect(
      await arrowToken
        .connect(signer1)
        .transferFrom(owner.address, signer2.address, amount)
    )
      .to.emit(arrowToken, "Transfer")
      .withArgs(owner.address, signer2.address, amount);
  });
});
