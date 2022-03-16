const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ArrowToken Transfering", function () {
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
    await arrowToken.deployed();
  });

  it("Should decrease sender's balance", async function () {
    let senderBalance = await arrowToken.balanceOf(owner.address);
    let amount = senderBalance;
    await arrowToken.transfer(signer1.address, amount);
    expect(await arrowToken.balanceOf(owner.address)).to.equal(
      senderBalance - amount
    );
  });

  it("Should increase receiver's balance", async function () {
    let receiverBalance = await arrowToken.balanceOf(signer1.address);
    let amount = await arrowToken.balanceOf(owner.address);
    await arrowToken.transfer(signer1.address, amount);
    expect(await arrowToken.balanceOf(signer1.address)).to.equal(
      receiverBalance + amount
    );
  });

  it("Should not affect the total supply of tokens", async function () {
    let totalSupply = await arrowToken.totalSupply();
    let amount = await arrowToken.balanceOf(owner.address);
    await arrowToken.transfer(signer1.address, amount);
    expect(await arrowToken.totalSupply()).to.equal(totalSupply);
  });

  it("Should correctly transfer the full balance", async function () {
    let amount = await arrowToken.balanceOf(owner.address);
    let receiverBalance = await arrowToken.balanceOf(signer1.address);
    await arrowToken.transfer(signer1.address, amount);
    expect(await arrowToken.balanceOf(owner.address)).to.equal(0);
    expect(await arrowToken.balanceOf(signer1.address)).to.equal(
      receiverBalance + amount
    );
  });

  it("Should correctly transfer zero token", async function () {
    let senderBalance = await arrowToken.balanceOf(owner.address);
    let receiverBalance = await arrowToken.balanceOf(signer1.address);
    await arrowToken.transfer(signer1.address, 0);
    expect(await arrowToken.balanceOf(owner.address)).to.equal(senderBalance);
    expect(await arrowToken.balanceOf(signer1.address)).to.equal(
      receiverBalance
    );
  });

  it("Should correctly transfer to self", async function () {
    let senderBalance = await arrowToken.balanceOf(owner.address);
    let amount = senderBalance;
    await arrowToken.transfer(owner.address, amount);
    expect(await arrowToken.balanceOf(owner.address)).to.equal(senderBalance);
  });

  it("Should revert when there's insufficient balance", async function () {
    let amount = await arrowToken.balanceOf(owner.address);
    await expect(arrowToken.transfer(signer1.address, amount + 1)).to.be
      .reverted;
  });

  it("Should emit event", async function () {
    let amount = await arrowToken.balanceOf(owner.address);
    expect(await arrowToken.transfer(signer1.address, amount))
      .to.emit(arrowToken, "Transfer")
      .withArgs(owner.address, signer1.address, amount);
  });
});
