// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./ArrowVestingBase.sol";

/**
    Factory contract for creating vesting wallets from their base implementations.
 */
/// @dev Should we make this upgradeable?
contract ArrowVestingFactory {
    address immutable vestingImplementation;

    constructor() {
        vestingImplementation = address(new ArrowVestingBase());
    }

    /**
        Creates a new cloned vesting wallet from its base implementation.

        The wallet will initially be empty and should have appropriate ERC20 tokens and ETH transferred to it after creation.
     */
    function createVestingSchedule(
        address beneficiaryAddress,
        uint64 startTimestamp,
        uint64 durationSeconds
    ) external returns (address) {
        address clone = Clones.clone(vestingImplementation);
        ArrowVestingBase(payable(clone)).initialize(
            beneficiaryAddress,
            startTimestamp,
            durationSeconds
        );
        return clone;
    }
}
