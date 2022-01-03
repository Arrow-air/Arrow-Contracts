pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

import "../ArrowGovernor.sol";

contract MockArrowGovernor is ArrowGovernor {
    constructor(ERC20Votes token, TimelockController timelock)
        ArrowGovernor(token, timelock) {}

    // Shorten delays for testing purposes.

    function votingDelay() public pure override returns (uint256) {
        return 2;
    }

    function votingPeriod() public pure override returns (uint256) {
        return 3;
    }
}
