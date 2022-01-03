pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
    @title Arrow Token implementation
 */
contract ArrowToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Arrow", "ARROW") {
        _mint(msg.sender, initialSupply);
    }
}