// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Valid import paths for hardhat (need to comment out when using brownie)
import "@openzeppelin/contracts-upgradeable/finance/VestingWalletUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title Base implementation of vesting contract that will be cloned into individual vesting wallets pointing at specific beneficiary addresses.
contract ArrowVestingBase is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    VestingWalletUpgradeable
{
    // implement the UUPS interface
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize(
        address beneficiaryAddress,
        uint64 startTimestamp,
        uint64 durationSeconds
    ) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __VestingWallet_init(
            beneficiaryAddress,
            startTimestamp,
            durationSeconds
        );
    }
}
