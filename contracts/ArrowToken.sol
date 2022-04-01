// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
    @title Arrow Token Implementation
    @notice This is an upgradeable contract that conforms to the ERC-20 standard
    @dev Upgrades can be made directly on this contract as versioning will be handled by git. However, one needs to keep any potential storage collisions in mind when introducing new variables/functions
*/
contract ArrowToken is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    /**
        @notice Ensures only the owner can upgrade this contract
        @dev Must be included for the UUPS proxy: https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable
    */
    function _authorizeUpgrade(address) internal override onlyOwner {}

     /**
        @notice Makes sure that the contract is initialized
        @dev Must be included for the UUPS proxy to prevent ownership attacks: https://forum.openzeppelin.com/t/security-advisory-initialize-uups-implementation-contracts/15301
    */
    ///@custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /** 
        @notice Mint an `_initialSupply` amount of tokens upon contract creation
        @dev If we were to upgrade the initializer by introducing new variables, we need to create a normal function like `initializeV2` (https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786/53), and make sure to include all existing variables from the current version of the contract to avoid storage collision
    */
    function initialize(uint256 _initialSupply, string memory _name, string memory _symbol) public initializer {
        __ERC20_init(_name, _symbol);
        __Ownable_init();
        __UUPSUpgradeable_init();

        _mint(msg.sender, _initialSupply);
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
