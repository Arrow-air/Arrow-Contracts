// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
    @title Arrow Token mock to test the upgradeable functionality
    @notice Create ARROW tokens of an `initialSupply` amount
    @dev If we were to upgrade the initializer by introducing new variables, we need to create a normal function like `initializeV2` (https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786/53), and make sure to include all existing variables from the current version of the contract to avoid storage collision
 */
contract ArrowTokenV2 is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    // new variable for testing purpose
    uint256 public myVal;

    /**
        @notice Ensures only the owner can upgrade this contract
        @dev Must be included for the UUPS proxy: https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable
    */
    function _authorizeUpgrade(address) internal override onlyOwner {}

    /** 
        @notice Introduce a new variable to test upgradability.
    */
    function initializeV2(uint256 _newVariableAmount) public {
        myVal = _newVariableAmount;
    }

    /**
        @notice Mint and issue new tokens to a specified address
        @param _to the address to issue new tokens to
        @param _amount the amount of tokens to be mint and transfered to `_to`
    */
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
}
