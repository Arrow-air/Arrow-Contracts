pragma solidity ^0.8.11;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ArrowVestingBase.sol";

/**
    @title Factory contract for creating vesting wallets from their base implementations
 */
contract ArrowVestingFactory is Ownable {
    
    address public vestingImplementation;

    event NewVestingAgreement(
        address beneficiaryAddress,
        uint64 startTimestamp,
        uint64 durationSeconds,
        address vestingWalletAddress
    );

    constructor() {
        vestingImplementation = address(new ArrowVestingBase());
    }

    /**
        @notice Creates a new cloned vesting wallet from its base implementation. The wallet will initially be empty and should have appropriate ERC20 tokens and ETH transferred to it after creation
        @param beneficiaryAddress The address of which the vesting is entitled to
        @param startTimestamp The start time of the vesting schedule
        @param durationSeconds Denotes the length of the vesting period
        @return clone The address of the vesting wallet implemented by `ArrowVestingBase`
     */
    function createVestingSchedule(
        address beneficiaryAddress,
        uint64 startTimestamp,
        uint64 durationSeconds
    ) external returns (address clone) {
        clone = Clones.clone(vestingImplementation);
        ArrowVestingBase(payable(clone)).initialize(beneficiaryAddress, startTimestamp, durationSeconds);
        emit NewVestingAgreement(beneficiaryAddress, startTimestamp, durationSeconds, payable(clone));
    }
}
