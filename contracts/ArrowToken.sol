pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
    @title Arrow Token implementation
 */
contract ArrowToken is ERC20, ERC20Permit, ERC20Votes {
    constructor(uint256 initialSupply)
        ERC20("Arrow", "ARROW")
        ERC20Permit("Arrow")
    {
        _mint(msg.sender, initialSupply);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
