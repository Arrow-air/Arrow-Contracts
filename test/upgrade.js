const chai = require("chai");
const { ethers, upgrades } = require("hardhat");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("Contract Upgrades", function () {
  let Token;
  let arrowToken;
  let TokenV2;
  let arrowTokenV2;
  let owner;
  let signer1;
  let signer2;
  let amountTransferredToSigner1;

  before(async function () {
    Token = await ethers.getContractFactory("ArrowToken");
    [owner, signer1, signer2] = await ethers.getSigners();
    let name = "Arrow Token";
    let symbol = "ARROW";
    arrowToken = await upgrades.deployProxy(
      Token,
      [ethers.BigNumber.from(1_000_000), name, symbol],
      { kind: "uups" },
    );
    await arrowToken.deployed();

    // Transfer all of owner's tokens to signer1
    let senderBalance = ethers.BigNumber.from(
      await arrowToken.balanceOf(owner.address),
    );
    amountTransferredToSigner1 = senderBalance;
    await arrowToken.transfer(signer1.address, amountTransferredToSigner1);
    expect(await arrowToken.balanceOf(owner.address)).to.equal(
      senderBalance - amountTransferredToSigner1,
    );

    TokenV2 = await ethers.getContractFactory("ArrowTokenV2");
    arrowTokenV2 = await upgrades.upgradeProxy(arrowToken, TokenV2, {
      call: { fn: "initializeV2", args: [52] },
    });
  });

  describe("Upgrade ArrowToken to ArrowTokenV2", function () {
    it("V2 should have the same amount of token supplies as the older contract", async function () {
      assert.strictEqual(
        new ethers.BigNumber.from(await arrowTokenV2.totalSupply()),
        1_000_000,
        "initial supply of 1,000,000 tokens",
      );
    });

    it("Should have the correct token balance for each account", async function () {
      let ownerBalance = new ethers.BigNumber.from(
        await arrowTokenV2.balanceOf(owner.address),
      );
      let signer1Balance = await arrowTokenV2.balanceOf(signer1.address);
      expect(ownerBalance).to.equal(0); // because in V1 we already transferred all of owner's tokens
      expect(signer1Balance).to.equal(amountTransferredToSigner1);
    });

    it("Should have the correct value for state variable `myVal`", async function () {
      assert.strictEqual(await arrowTokenV2.myVal(), 52, "myVal value");
    });

    it("V2 should be forwarded to by the same proxy contract as V1", async function () {
      assert.strictEqual(
        arrowTokenV2.address,
        arrowToken.address,
        "contract address",
      );
    });

    it("V2 should be able to mint tokens to self", async function () {
      await arrowTokenV2.mint(
        arrowTokenV2.address,
        ethers.BigNumber.from(1_000_000),
      );
      expect(
        new ethers.BigNumber.from(await arrowTokenV2.totalSupply()),
      ).to.equal(2_000_000);
    });

    it("V2 should be able to mint tokens to other signers", async function () {
      let signerBalanceBefore = new ethers.BigNumber.from(
        await arrowTokenV2.balanceOf(signer1.address),
      );
      let amount = ethers.BigNumber.from(1_000);
      expect(signerBalanceBefore).to.equal(amountTransferredToSigner1);

      await arrowTokenV2.mint(signer1.address, amount);

      let signerBalanceAfter = new ethers.BigNumber.from(
        await arrowTokenV2.balanceOf(signer1.address),
      );

      expect(signerBalanceAfter - amount).to.equal(signerBalanceBefore);
    });

    it("V2 should have a different address from V1 and the proxy contract", async function () {
      expect(arrowTokenV2.address).not.equal(
        await upgrades.erc1967.getImplementationAddress(arrowToken.address),
      );
      expect(arrowTokenV2.address).not.equal(
        await upgrades.erc1967.getImplementationAddress(arrowTokenV2.address),
      );
    });

    it("Should decrease sender's balance", async function () {
      let senderBalance = await arrowTokenV2.balanceOf(signer1.address);
      let amount = senderBalance;
      await arrowTokenV2.connect(signer1).transfer(owner.address, amount);
      expect(await arrowTokenV2.balanceOf(signer1.address)).to.equal(
        senderBalance - amount,
      );
    });

    it("Should increase receiver's balance", async function () {
      let receiverBalance = await arrowTokenV2.balanceOf(signer2.address);
      let amount = await arrowTokenV2.balanceOf(owner.address);

      await arrowTokenV2.approve(signer1.address, amount);
      await arrowTokenV2
        .connect(signer1)
        .transferFrom(owner.address, signer2.address, amount);
      expect(await arrowTokenV2.balanceOf(signer2.address)).to.equal(
        receiverBalance + amount,
      );
    });
  });
});
