const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Contract Deployments", function () {
  let owner;
  let beneficiary;

  beforeEach(async function () {
    [owner, beneficiary] = await ethers.getSigners();
  });

  describe("ArrowToken Deployment", function () {
    let Token;
    let arrowToken;

    let amount = 1_000_000;
    beforeEach(async function () {
      Token = await ethers.getContractFactory("ArrowToken");
      let name = "Arrow Token";
      let symbol = "ARROW";
      arrowToken = await Token.deploy(
        ethers.BigNumber.from(1_000_000),
        name,
        symbol
      );
      await arrowToken.deployed();
    });
    it("Should set the right owner", async function () {
      expect(await arrowToken.owner()).to.equal(owner.address);
    });

    it("Should have the right amount of tokens", async function () {
      assert.strictEqual(
        parseInt(ethers.utils.formatUnits(await arrowToken.totalSupply(), 0)),
        amount,
        `initial supply of ${amount} tokens`
      );
    });
  });

  describe("ArrowVestingBase Deployment", function () {
    it("Should deploy successfully", async function () {
      let VestingBase = await ethers.getContractFactory("ArrowVestingBase");
      let vestingBase = await VestingBase.deploy();
      vestingBase
        .deployed()
        .then(() => {
          expect(true).to.be.true;
        })
        .catch((e) => {
          expect(false, e).to.be.true;
        });
    });
  });

  describe("ArrowVestingFactory Deployment", function () {
    it("Should deploy successfully", async function () {
      let VestingFactory = await ethers.getContractFactory(
        "ArrowVestingFactory"
      );
      let vestingFactory = await VestingFactory.deploy();
      vestingFactory
        .deployed()
        .then(() => {
          expect(true).to.be.true;
        })
        .catch((e) => {
          expect(false, e).to.be.true;
        });
    });
  });
});
