// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title Arrow Token implementation that is upgradeable
/// @notice Create ARROW tokens of an `initialSupply` amount
/// @dev If we were to upgrade the initializer by introducing new variables, we need to create a normal function like `initializeV2` (https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786/53), and make sure to include all existing variables from the current version of the contract to avoid storage collision
contract ArrowToken is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    // implement the UUPS interface
    function _authorizeUpgrade(address) internal override onlyOwner {}

    ///@notice Mint an `_initialSupply` amount of tokens upon contract creation
    function initialize(uint256 _initialSupply) public initializer {
        __ERC20_init("Arrow", "ARROW");
        __Ownable_init();
        __UUPSUpgradeable_init();

        _mint(msg.sender, _initialSupply);
    }

    /// @notice Mint and issue new tokens to a specified address
    /// @param _to the address to issue new tokens to
    /// @param _amount the amount of tokens to be mint and transfered to `_to`
    function issueNewTokens(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
}
