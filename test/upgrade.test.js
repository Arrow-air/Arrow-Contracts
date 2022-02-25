const { expect, assert } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Contract Upgrades", function () {
  let Token;
  let arrowToken;
  let TokenV2;
  let arrowTokenV2;
  let owner;
  let signer1;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ArrowToken");
    [owner, signer1] = await ethers.getSigners();
    arrowToken = await upgrades.deployProxy(Token, [
      ethers.BigNumber.from(1_000_000),
    ]);
    await arrowToken.deployed();
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
        "initial supply of 1,000,000 tokens"
      );
    });

    it("Should have the correct value for state variable `myVal`", async function () {
      assert.strictEqual(await arrowTokenV2.myVal(), 52, "myVal value");
    });

    it("V2 should be forwarded to by the same proxy contract as V1", async function () {
      assert.strictEqual(
        arrowTokenV2.address,
        arrowToken.address,
        "contract address"
      );
    });

    it("V2 should be able to mint tokens to self", async function () {
      await arrowTokenV2.mint(
        arrowTokenV2.address,
        ethers.BigNumber.from(1_000_000)
      );
      expect(
        new ethers.BigNumber.from(await arrowTokenV2.totalSupply())
      ).to.equal(2_000_000);
    });

    it("V2 should be able to mint tokens to other signers", async function () {
      let signerBalanceBefore = new ethers.BigNumber.from(
        await arrowTokenV2.balanceOf(signer1.address)
      );
      let amount = ethers.BigNumber.from(1_000);
      expect(signerBalanceBefore).to.equal(0);

      await arrowTokenV2.mint(signer1.address, amount);

      let signerBalanceAfter = new ethers.BigNumber.from(
        await arrowTokenV2.balanceOf(signer1.address)
      );

      expect(signerBalanceAfter - amount).to.equal(signerBalanceBefore);
    });

    it("V2 should have a different address from V1 and the proxy contract", async function () {
      expect(arrowTokenV2.address).not.equal(
        await upgrades.erc1967.getImplementationAddress(arrowToken.address)
      );
      expect(arrowTokenV2.address).not.equal(
        await upgrades.erc1967.getImplementationAddress(arrowTokenV2.address)
      );
    });
  });
});
