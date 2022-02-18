pragma solidity ^0.8.11;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
    @title Arrow Token implementation
 */
contract ArrowToken is ERC20, Ownable {
    constructor(uint256 initialSupply)
        ERC20("Arrow", "ARROW")
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
