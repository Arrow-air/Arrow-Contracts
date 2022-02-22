const { expect, assert } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("ArrowToken Contract", function () {
  let Token;
  let arrowToken;
  let owner;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ArrowToken");
    owner = await ethers.getSigner();
    arrowToken = await upgrades.deployProxy(Token, [
      ethers.BigNumber.from(1_000_000),
    ]);
    await arrowToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await arrowToken.owner()).to.equal(owner.address);
    });

    it("Should have 1,000,000 tokens", async function () {
      assert.strictEqual(
        new ethers.BigNumber.from(await arrowToken.totalSupply()),
        1_000_000,
        "initial supply of 1,000,000 tokens"
      );
    });
  });

  describe("Upgrade Contract", function () {
    it("V2 should have the same amount of token supplies as the older contract", async function () {
      const TokenV2 = await ethers.getContractFactory("ArrowTokenV2");
      const arrowTokenV2 = await upgrades.upgradeProxy(arrowToken, TokenV2, {
        call: { fn: "initializeV2", args: [52] },
      });
      assert.strictEqual(
        new ethers.BigNumber.from(await arrowTokenV2.totalSupply()),
        1_000_000,
        "initial supply of 1,000,000 tokens"
      );
    });

    it("V2's myVal should be 52", async function () {
      const TokenV2 = await ethers.getContractFactory("ArrowTokenV2");
      const arrowTokenV2 = await upgrades.upgradeProxy(arrowToken, TokenV2, {
        call: { fn: "initializeV2", args: [52] },
      });
      assert.strictEqual(await arrowTokenV2.myVal(), 52, "myVal value");
    });

    it("V2 should have the same contract address as V1", async function () {
      const TokenV2 = await ethers.getContractFactory("ArrowTokenV2");
      const arrowTokenV2 = await upgrades.upgradeProxy(arrowToken, TokenV2, {
        call: { fn: "initializeV2", args: [52] },
      });
      assert.strictEqual(
        arrowTokenV2.address,
        arrowToken.address,
        "contract address"
      );
    });
  });
});
