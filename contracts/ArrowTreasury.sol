pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
    @title Arrow Treasury implementation

    This contract is responsible for holding funds and executing proposals submitted to the ArrowGovernor contract.
 */
contract ArrowTreasury is TimelockController {

    constructor(uint256 minDelay, address[] memory proposers, address[] memory executors)
        TimelockController(minDelay, proposers, executors) {}
}
