pragma solidity ^0.8.11;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
    @title Arrow Token implementation
 */
contract ArrowToken is ERC20, Ownable {

    /// @notice This function assigns msg.sender as the token admin and mints them initial supply
    constructor(uint256 initialSupply, string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {
        _mint(msg.sender, initialSupply);
    }

    /**
        Mints new tokens.

        Only accepts calls from the contract owner.
     */
    function mint(address to, uint256 amount) public onlyOwner
    {
        _mint(to, amount);
    }
}
