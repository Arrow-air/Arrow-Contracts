pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

/**
    @title Arrow Governor implementation

    This contract is responsible for managing new proposals and votes submitted to the ArrowTreasury.

    When deployed, this should be added as the sole proposer role to the ArrowTreasury.
 */
contract ArrowGovernor is Governor, GovernorCompatibilityBravo, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(ERC20Votes token, TimelockController timelock)
        Governor("ArrowGovernor")
        GovernorVotes(token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(timelock)
    {}

    /**
        Defines the delay between when a new proposal is created and when it becomes eligible for voting.
     */
    function votingDelay() public pure virtual override returns (uint256) {
        return 6575; // 1 day
    }

    /**
        Defines the length of the period of voting before a proposal is marked as a success or failure. 
     */
    function votingPeriod() public pure virtual override returns (uint256) {
        return 46027; // 1 week
    }

    /**
        Defines the number of arrow tokens required to create a new proposal.
     */
    function proposalThreshold() public pure override returns (uint256) {
        return 1000; // 1000 ARROW tokens are needed to submit a new proposal.
    }

    // The functions below are overrides required by Solidity.

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, IGovernor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor, GovernorCompatibilityBravo, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, IERC165, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
