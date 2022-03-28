// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts-upgradeable/finance/VestingWalletUpgradeable.sol";

/** 
    @title Base implementation of vesting contract that will be cloned into individual vesting wallets pointing at specific beneficiary addresses.
    @dev Although the contract inherits an upgradeable interface, the contract itself is not intended to be upgradeable; rather, it is intended to be cloned by `ArrowVestingFactory`.
*/
contract ArrowVestingBase is VestingWalletUpgradeable {

    constructor() initializer {}

    function initialize(
        address beneficiaryAddress,
        uint64 startTimestamp,
        uint64 durationSeconds
    ) public initializer {
        __VestingWallet_init(beneficiaryAddress, startTimestamp, durationSeconds);
    }
}
