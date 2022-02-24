pragma solidity ^0.8.11;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/finance/VestingWalletUpgradeable.sol";
// import "@openzeppelin-upgradeable/contracts/finance/VestingWalletUpgradeable.sol";

/**
    Base implementation of vesting contract that will be cloned into individual vesting wallets pointing at specific beneficiary addresses.
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
