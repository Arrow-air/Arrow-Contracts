const { expect, assert } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Vesting Contracts", function () {
  describe("Single Account Vesting", function () {
    let arrowToken;
    let vestingFactory;
    let vestingContract;
    let beneficiary1;

    let startTimestamp;
    let durationSeconds = 100;
    let amount = 1_000_000;

    it("Should correctly vest", async function () {
      let VestingFactory = await ethers.getContractFactory(
        "ArrowVestingFactory"
      );
      let Token = await ethers.getContractFactory("ArrowToken");
      let name = "Arrow Token";
      let symbol = "ARROW";
      arrowToken = await upgrades.deployProxy(
        Token,
        [ethers.BigNumber.from(1_000_000), name, symbol],
        { kind: "uups" }
      );
      await arrowToken.deployed();
      let VestingBase = await ethers.getContractFactory("ArrowVestingBase");

      [_, beneficiary1] = await ethers.getSigners();
      vestingFactory = await VestingFactory.deploy();
      await vestingFactory.deployed();

      // get block timestamp
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      startTimestamp = block.timestamp + 100;

      // use callStatic to get what the address would be when the transaction is created
      let vestingWalletAddress =
        await vestingFactory.callStatic.createVestingSchedule(
          beneficiary1.address,
          startTimestamp,
          durationSeconds
        );
      // actually create the transaction so that the child contract can be deployed on chain
      let txn = await vestingFactory.createVestingSchedule(
        beneficiary1.address,
        startTimestamp,
        durationSeconds
      );
      await txn.wait();
      vestingContract = await VestingBase.attach(vestingWalletAddress);

      /*---------------------------------Test Begin---------------------------------**/

      // Add tokens to the contract
      await arrowToken.transfer(vestingContract.address, amount);
      expect(await arrowToken.balanceOf(vestingContract.address)).to.equal(
        amount
      );
      console.log("√ Pass - Add tokens to the contract");

      // Check contract variables have been set correctly
      expect(await vestingContract.start()).to.equal(startTimestamp);
      expect(await vestingContract.duration()).to.equal(durationSeconds);
      expect(
        await vestingContract
          .connect(beneficiary1)
          ["released(address)"](arrowToken.address)
      ).to.equal(0);
      console.log("√ Pass - Check contract variables have been set correctly");

      //No tokens should have been immediately released
      expect(await arrowToken.balanceOf(beneficiary1.address)).to.equal(0);
      await vestingContract
        .connect(beneficiary1)
        ["release(address)"](arrowToken.address);
      expect(await arrowToken.balanceOf(beneficiary1.address)).to.equal(0);
      console.log("√ Pass - No tokens should have been immediately released");

      //No tokens should have been released before the end of the vesting cliff
      await ethers.provider.send("evm_setAutomine", [false]);
      await ethers.provider.send("evm_mine", [startTimestamp]);
      await vestingContract
        .connect(beneficiary1)
        ["release(address)"](arrowToken.address);

      var blockNumAfter = await ethers.provider.getBlockNumber();
      var blockAfter = await ethers.provider.getBlock(blockNumAfter);
      var timestampAfter = blockAfter.timestamp;

      await assert.strictEqual(
        await arrowToken.balanceOf(beneficiary1.address),
        (amount * (timestampAfter - startTimestamp)) / durationSeconds
      );
      console.log(
        "√ Pass - No tokens should have been released before the end of the vesting cliff"
      );

      // Half the tokens should be vested when half the vesting duration has elapsed
      await ethers.provider.send("evm_mine", [
        startTimestamp + Number(durationSeconds / 2),
      ]);

      await vestingContract
        .connect(beneficiary1)
        ["release(address)"](arrowToken.address);

      blockNumAfter = await ethers.provider.getBlockNumber();
      blockAfter = await ethers.provider.getBlock(blockNumAfter);
      timestampAfter = blockAfter.timestamp;

      await assert.strictEqual(
        await arrowToken.balanceOf(beneficiary1.address),
        (amount * (timestampAfter - startTimestamp)) / durationSeconds
      );
      console.log(
        "√ Pass - Half the tokens should be vested when half the vesting duration has elapsed"
      );

      // All tokens should be vested when the vesting duration has elapsed
      await ethers.provider.send("evm_mine", [
        startTimestamp + durationSeconds,
      ]);
      await vestingContract
        .connect(beneficiary1)
        ["release(address)"](arrowToken.address);

      blockNumAfter = await ethers.provider.getBlockNumber();
      blockAfter = await ethers.provider.getBlock(blockNumAfter);
      timestampAfter = blockAfter.timestamp;

      await assert.strictEqual(
        await arrowToken.balanceOf(beneficiary1.address),
        amount
      );
      console.log(
        "√ Pass - All tokens should be vested when the vesting duration has elapsed"
      );
    });
  });

  describe("Multiple Accounts Vesting", function () {
    let arrowToken;
    let vestingFactory;
    let vestingContract;
    let vestingContract2;
    let beneficiary1;
    let beneficiary2;

    let startTimestamp;
    let durationSeconds = 100;
    let amount = 1_000_000;

    let startTimestamp2;
    let durationSeconds2 = 200;
    let amount2 = 2_000_000;

    it("Should correctly vest", async function () {
      await ethers.provider.send("evm_setAutomine", [true]);
      let VestingFactory = await ethers.getContractFactory(
        "ArrowVestingFactory"
      );
      let Token = await ethers.getContractFactory("ArrowToken");
      let name = "Arrow Token";
      let symbol = "ARROW";
      arrowToken = await upgrades.deployProxy(
        Token,
        [ethers.BigNumber.from(100_000_000), name, symbol],
        { kind: "uups" }
      );
      await arrowToken.deployed();
      let VestingBase = await ethers.getContractFactory("ArrowVestingBase");

      [_, beneficiary1, beneficiary2] = await ethers.getSigners();
      vestingFactory = await VestingFactory.deploy();
      await vestingFactory.deployed();

      // get block timestamp
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      startTimestamp = block.timestamp + 200;
      startTimestamp2 = block.timestamp + 250;

      // use callStatic to get what the address would be when the transaction is created
      var vestingWalletAddress =
        await vestingFactory.callStatic.createVestingSchedule(
          beneficiary1.address,
          ethers.BigNumber.from(startTimestamp),
          ethers.BigNumber.from(durationSeconds)
        );
      // actually create the transaction so that the child contract can be deployed on chain
      var txn = await vestingFactory.createVestingSchedule(
        beneficiary1.address,
        ethers.BigNumber.from(startTimestamp),
        ethers.BigNumber.from(durationSeconds)
      );
      await txn.wait();
      vestingContract = await VestingBase.attach(vestingWalletAddress);

      // use callStatic to get what the address would be when the transaction is created
      vestingWalletAddress =
        await vestingFactory.callStatic.createVestingSchedule(
          beneficiary2.address,
          ethers.BigNumber.from(startTimestamp2),
          ethers.BigNumber.from(durationSeconds2)
        );
      // actually create the transaction so that the child contract can be deployed on chain
      txn = await vestingFactory.createVestingSchedule(
        beneficiary2.address,
        ethers.BigNumber.from(startTimestamp2),
        ethers.BigNumber.from(durationSeconds2)
      );
      await txn.wait();
      vestingContract2 = await VestingBase.attach(vestingWalletAddress);

      /*---------------------------------Test Begin---------------------------------**/
      expect(await arrowToken.balanceOf(beneficiary1.address)).to.equal(0);
      expect(await arrowToken.balanceOf(beneficiary2.address)).to.equal(0);

      // Load contracts with tokens
      await arrowToken.transfer(vestingContract.address, amount);
      await arrowToken.transfer(vestingContract2.address, amount2);

      console.log("√ Pass - Load contracts with tokens");

      expect(await arrowToken.balanceOf(vestingContract.address)).to.equal(
        amount
      );
      expect(await arrowToken.balanceOf(vestingContract2.address)).to.equal(
        amount2
      );

      //No tokens should have been immediately released
      await ethers.provider.send("evm_setAutomine", [false]);
      await ethers.provider.send("evm_mine", [startTimestamp]);

      await vestingContract
        .connect(beneficiary1)
        ["release(address)"](arrowToken.address);

      expect(await arrowToken.balanceOf(beneficiary1.address)).to.equal(0);

      await vestingContract2
        .connect(beneficiary2)
        ["release(address)"](arrowToken.address);

      expect(await arrowToken.balanceOf(beneficiary2.address)).to.equal(0);

      console.log("√ Pass - No tokens should have been immediately released");

      //Start of first vesting
      await ethers.provider.send("evm_mine", [startTimestamp2]);

      await vestingContract
        .connect(beneficiary1)
        ["release(address)"](arrowToken.address);

      var blockNumAfter = await ethers.provider.getBlockNumber();
      var blockAfter = await ethers.provider.getBlock(blockNumAfter);
      var timestampAfter = blockAfter.timestamp;

      await assert.strictEqual(
        await arrowToken.balanceOf(beneficiary1.address),
        (amount * (timestampAfter - startTimestamp)) / durationSeconds
      );

      await vestingContract2
        .connect(beneficiary2)
        ["release(address)"](arrowToken.address);

      blockNumAfter = await ethers.provider.getBlockNumber();
      blockAfter = await ethers.provider.getBlock(blockNumAfter);
      timestampAfter = blockAfter.timestamp;

      await assert.strictEqual(
        await arrowToken.balanceOf(beneficiary2.address),
        (amount2 * (timestampAfter - startTimestamp2)) / durationSeconds2
      );

      console.log("√ Pass - Start of first vesting");
      // End of first vesting.
      await ethers.provider.send("evm_mine", [
        startTimestamp + durationSeconds,
      ]);

      await vestingContract
        .connect(beneficiary1)
        ["release(address)"](arrowToken.address);

      blockNumAfter = await ethers.provider.getBlockNumber();
      blockAfter = await ethers.provider.getBlock(blockNumAfter);
      timestampAfter = blockAfter.timestamp;

      await assert.strictEqual(
        await arrowToken.balanceOf(beneficiary1.address),
        amount
      );

      await vestingContract2
        .connect(beneficiary2)
        ["release(address)"](arrowToken.address);

      blockNumAfter = await ethers.provider.getBlockNumber();
      blockAfter = await ethers.provider.getBlock(blockNumAfter);
      timestampAfter = blockAfter.timestamp;

      await assert.strictEqual(
        await arrowToken.balanceOf(beneficiary2.address),
        (amount2 * (timestampAfter - startTimestamp2)) / durationSeconds2
      );

      console.log("√ Pass - End of first vesting");
      // End of second vesting
      await ethers.provider.send("evm_mine", [
        startTimestamp2 + durationSeconds2,
      ]);
      await vestingContract
        .connect(beneficiary1)
        ["release(address)"](arrowToken.address);

      blockNumAfter = await ethers.provider.getBlockNumber();
      blockAfter = await ethers.provider.getBlock(blockNumAfter);
      timestampAfter = blockAfter.timestamp;

      await assert.strictEqual(
        await arrowToken.balanceOf(beneficiary1.address),
        amount
      );

      await vestingContract2
        .connect(beneficiary2)
        ["release(address)"](arrowToken.address);

      blockNumAfter = await ethers.provider.getBlockNumber();
      blockAfter = await ethers.provider.getBlock(blockNumAfter);
      timestampAfter = blockAfter.timestamp;

      await assert.strictEqual(
        await arrowToken.balanceOf(beneficiary2.address),
        amount2
      );
      console.log("√ Pass - End of second vesting");
    });
  });

  describe("Vesting Contract Cancelling", function () {
    let arrowToken;
    let vestingFactory;

    let vestingContract;
    let beneficiary;
    let startTimestamp;

    let tokenSupply = 100_000_000;
    let duration = 100;
    let amount = 100;

    beforeEach(async function () {
      // Deploy base contracts.
      await ethers.provider.send("evm_setAutomine", [true]);

      vestingBaseFactory = await ethers.getContractFactory("ArrowVestingBase");
      vestingContractFactory = await ethers.getContractFactory("ArrowVestingFactory");
      vestingFactory = await vestingContractFactory.deploy();
      await vestingFactory.deployed()

      arrowToken = await upgrades.deployProxy(
        await ethers.getContractFactory("ArrowToken"),
        [ethers.BigNumber.from(tokenSupply), "Arrow Token", "ARROW"],
        { kind: "uups" }
      );
      await arrowToken.deployed();

      // Deploy vesting contract.
      [owner, beneficiary] = await ethers.getSigners();

      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      startTimestamp = block.timestamp + 10;

      const vestingWalletAddress = await vestingFactory.callStatic.createVestingSchedule(
        beneficiary.address,
        ethers.BigNumber.from(startTimestamp),
        ethers.BigNumber.from(duration)
      );

      tx = await vestingFactory.createVestingSchedule(
        beneficiary.address,
        ethers.BigNumber.from(startTimestamp),
        ethers.BigNumber.from(duration)
      );
      await tx.wait();

      vestingContract = await vestingBaseFactory.attach(vestingWalletAddress);

      // Load the vesting contract with some tokens.
      await arrowToken.transfer(vestingContract.address, amount);
      await owner.sendTransaction({ to: vestingContract.address, value: amount });
    });

    it("Should have deployed vesting contract successfully", async function () {
      expect(await arrowToken.balanceOf(vestingContract.address)).to.equal(amount);
      expect(await ethers.provider.getBalance(vestingContract.address)).to.equal(amount);
      expect(await vestingContract["vestedAmount(address,uint64)"](arrowToken.address, startTimestamp)).to.equal(0);
      expect(await vestingContract["vestedAmount(address,uint64)"](arrowToken.address, startTimestamp + duration / 2)).to.equal(amount / 2);
    });

    it("Should return all tokens to factory owner if cancelled before vesting start", async function () {
      await ethers.provider.send("evm_setNextBlockTimestamp", [startTimestamp]);

      const factoryOwner = await vestingFactory.owner();
  
      const ownerBalanceBefore = await arrowToken.balanceOf(factoryOwner);

      tx = await vestingContract["cancel(address)"](arrowToken.address);
      await tx.wait();

      expect(await arrowToken.balanceOf(vestingContract.address)).to.equal(0);
      expect(await arrowToken.balanceOf(factoryOwner)).to.equal(ownerBalanceBefore.add(amount));
    });

    it("Should return all ETH to factory owner if cancelled before vesting start", async function () {
      await ethers.provider.send("evm_setNextBlockTimestamp", [startTimestamp]);

      const factoryOwner = await vestingFactory.owner();
  
      const ownerBalanceBefore = await ethers.provider.getBalance(factoryOwner);

      tx = await vestingContract["cancel()"]();
      receipt = await tx.wait();

      gasUsedWei = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      expect(await ethers.provider.getBalance(vestingContract.address)).to.equal(0);
      expect(await ethers.provider.getBalance(factoryOwner)).to.equal(ownerBalanceBefore.add(amount).sub(gasUsedWei));
    });

    it("Should distribute vested and unvested tokens fairly if cancelled during vesting", async function () {
      await ethers.provider.send("evm_setNextBlockTimestamp", [startTimestamp + duration / 4]);

      const factoryOwner = await vestingFactory.owner();
  
      const ownerBalanceBefore = await arrowToken.balanceOf(factoryOwner);
      const beneficiaryBalanceBefore = await arrowToken.balanceOf(beneficiary.address);

      tx = await vestingContract["cancel(address)"](arrowToken.address);
      await tx.wait();

      expect(await arrowToken.balanceOf(vestingContract.address)).to.equal(0);

      // 1/4 of vesting has occurred, so 1/4 tokens should be sent to beneficiary.
      expect(await arrowToken.balanceOf(beneficiary.address)).to.equal(beneficiaryBalanceBefore.add(amount / 4));

      // Remaining tokens should be returned to the factory owner.
      expect(await arrowToken.balanceOf(factoryOwner)).to.equal(ownerBalanceBefore.add(amount / 4 * 3));
    });

    it("Should distribute vested and unvested ETH fairly if cancelled during vesting", async function () {
      await ethers.provider.send("evm_setNextBlockTimestamp", [startTimestamp + duration / 4]);

      const factoryOwner = await vestingFactory.owner();
  
      const ownerBalanceBefore = await ethers.provider.getBalance(factoryOwner);
      const beneficiaryBalanceBefore = await ethers.provider.getBalance(beneficiary.address);

      tx = await vestingContract["cancel()"]();
      receipt = await tx.wait();

      gasUsedWei = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      expect(await ethers.provider.getBalance(vestingContract.address)).to.equal(0);

      // 1/4 of vesting has occurred, so 1/4 tokens should be sent to beneficiary.
      expect(await ethers.provider.getBalance(beneficiary.address)).to.equal(beneficiaryBalanceBefore.add(amount / 4));

      // Remaining tokens should be returned to the factory owner.
      expect(await ethers.provider.getBalance(factoryOwner)).to.equal(ownerBalanceBefore.add(amount / 4 * 3).sub(gasUsedWei));
    });

    it("Should distribute all tokens to beneficiary if cancelled after vesting", async function () {
      await ethers.provider.send("evm_setNextBlockTimestamp", [startTimestamp + duration]);

      const factoryOwner = await vestingFactory.owner();
  
      const ownerBalanceBefore = await arrowToken.balanceOf(factoryOwner);
      const beneficiaryBalanceBefore = await arrowToken.balanceOf(beneficiary.address);

      tx = await vestingContract["cancel(address)"](arrowToken.address);
      await tx.wait();

      expect(await arrowToken.balanceOf(vestingContract.address)).to.equal(0);
      expect(await arrowToken.balanceOf(beneficiary.address)).to.equal(beneficiaryBalanceBefore.add(amount));
      expect(await arrowToken.balanceOf(factoryOwner)).to.equal(ownerBalanceBefore);
    });

    it("Should distribute tokens to new owner after cancel if ownership was transferred", async function () {
      // Transfer ownership to new account.
      const accounts = await ethers.getSigners();
      const newOwner = accounts[3];

      const oldOwner = await vestingFactory.owner();
      expect(oldOwner).to.not.equal(newOwner.address);

      await vestingFactory.transferOwnership(newOwner.address);

      expect(await vestingFactory.owner()).to.equal(newOwner.address);

      // Cancelling should only be allowed by current owner.
      await expect(vestingContract["cancel(address)"](arrowToken.address)).to.be.revertedWith("Not factory owner");

      // Current owner should be able to cancel.
      await ethers.provider.send("evm_setNextBlockTimestamp", [startTimestamp + duration / 4]);

      const ownerBalanceBefore = await arrowToken.balanceOf(newOwner.address);
      const beneficiaryBalanceBefore = await arrowToken.balanceOf(beneficiary.address);

      tx = await vestingContract.connect(newOwner)["cancel(address)"](arrowToken.address);
      await tx.wait();

      expect(await arrowToken.balanceOf(vestingContract.address)).to.equal(0);
      expect(await arrowToken.balanceOf(beneficiary.address)).to.equal(beneficiaryBalanceBefore.add(amount / 4));
      expect(await arrowToken.balanceOf(newOwner.address)).to.equal(ownerBalanceBefore.add(amount / 4 * 3));
    });

    it("Should distribute ETH to new owner after cancel if ownership was transferred", async function () {
      // Transfer ownership to new account.
      const accounts = await ethers.getSigners();
      const newOwner = accounts[3];

      const oldOwner = await vestingFactory.owner();
      expect(oldOwner).to.not.equal(newOwner.address);

      await vestingFactory.transferOwnership(newOwner.address);

      expect(await vestingFactory.owner()).to.equal(newOwner.address);

      // Cancelling should only be allowed by current owner.
      await expect(vestingContract["cancel()"]()).to.be.revertedWith("Not factory owner");

      // Current owner should be able to cancel.
      await ethers.provider.send("evm_setNextBlockTimestamp", [startTimestamp + duration / 4]);

      const ownerBalanceBefore = await ethers.provider.getBalance(newOwner.address);
      const beneficiaryBalanceBefore = await ethers.provider.getBalance(beneficiary.address);

      tx = await vestingContract.connect(newOwner)["cancel()"]();
      receipt = await tx.wait();

      gasUsedWei = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      expect(await ethers.provider.getBalance(vestingContract.address)).to.equal(0);
      expect(await ethers.provider.getBalance(beneficiary.address)).to.equal(beneficiaryBalanceBefore.add(amount / 4));
      expect(await ethers.provider.getBalance(newOwner.address)).to.equal(ownerBalanceBefore.add(amount / 4 * 3).sub(gasUsedWei));
    });

    it("Should be able to update factory successfully", async function () {
      const accounts = await ethers.getSigners();
      const newOwner = accounts[3];

      const vestingContractFactory = await ethers.getContractFactory("ArrowVestingFactory");
      const newVestingFactory = await vestingContractFactory.connect(newOwner).deploy();

      expect(newVestingFactory.address).to.not.equal(vestingFactory);

      await expect(vestingContract.connect(newOwner).updateFactory(newVestingFactory.address)).to.be.revertedWith("Not factory owner");
      await expect(vestingContract.connect(newOwner)["cancel(address)"](arrowToken.address)).to.be.revertedWith("Not factory owner");

      await vestingContract.updateFactory(newVestingFactory.address);

      await expect(vestingContract["cancel(address)"](arrowToken.address)).to.be.revertedWith("Not factory owner");
      await expect(vestingContract.connect(newOwner)["cancel(address)"](arrowToken.address)).to.not.be.reverted;
    });
  });
});
