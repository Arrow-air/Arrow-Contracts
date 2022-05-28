// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts-upgradeable/finance/VestingWalletUpgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./ArrowVestingFactory.sol";

/** 
    @title Base implementation of vesting contract that will be cloned into individual vesting wallets pointing at specific beneficiary addresses.
    @dev Although the contract inherits an upgradeable interface, the contract itself is not intended to be upgradeable; rather, it is intended to be cloned by `ArrowVestingFactory`.
*/
contract ArrowVestingBase is VestingWalletUpgradeable {

    ArrowVestingFactory private factory;

    modifier onlyFactoryOwner {
      require(msg.sender == factory.owner(), "Not factory owner");
      _;
    }

    constructor() initializer {}

    function initialize(
        address beneficiaryAddress,
        uint64 startTimestamp,
        uint64 durationSeconds
    ) public initializer {
        factory = ArrowVestingFactory(msg.sender);

        __VestingWallet_init(beneficiaryAddress, startTimestamp, durationSeconds);
    }

    /**
        @notice Cancels the vesting contract, releasing vested ETH to the beneficiary and unvested ETH back to the factory owner.
        
        Can only be called by the vesting factory owner.
    */
    function cancel() public onlyFactoryOwner {
        release();

        Address.sendValue(payable(factory.owner()), address(this).balance);
    }

    /**
        @notice Cancels the vesting contract, releasing vested tokens to the beneficiary and unvested tokens back to the factory owner.

        @param token Address of the ERC20 token contract to be cancelled.
        
        Can only be called by the vesting factory owner.
    */
    function cancel(address token) public onlyFactoryOwner {
        release(token);

        IERC20 erc20 = IERC20(token);

        SafeERC20.safeTransfer(erc20, factory.owner(), erc20.balanceOf(address(this)));
    }

    /**
        @notice Updates the factory contract owning the vesting contract to a new address.
        This should be called on all vesting contracts to transfer ownership of them to a new factory. 

        @param newFactory Address of the new factory contract that will own the vesting contract.
        
        Can only be called by the vesting factory owner.
    */
    function updateFactory(address newFactory) public onlyFactoryOwner {
        factory = ArrowVestingFactory(newFactory);
    }
}
