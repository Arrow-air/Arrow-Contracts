
import pytest

import brownie

from brownie import web3

def test_new_proposal(chain, token, governor, treasury, accounts, admin):

    payee_account = accounts[1]
    amount = 1000000
    description = "Proposal: Grant Payee"

    assert token.balanceOf(payee_account) == 0

    # Load treasury with ARROW.
    token.transfer(treasury, amount, {"from": admin})

    assert token.balanceOf(treasury) == amount

    # Delegate voting power to self before vote.
    token.delegate(admin, {"from": admin})

    # Create a proposal.
    proposal_calldata = token.transfer.encode_input(payee_account, amount)

    proposal_id = governor.propose(
        [token],
        [0],
        [proposal_calldata],
        description
    ).return_value

    # Wait until the proposal becomes active.
    chain.mine(governor.votingDelay())

    # Cast 100% votes to succeed.
    governor.castVote(proposal_id, True, {"from": admin})

    # Wait for voting period to end.
    chain.mine(governor.votingPeriod())

    # Execute the proposal.
    description_hash = web3.keccak(text=description)

    governor.queue(
        [token],
        [0],
        [proposal_calldata],
        description_hash,
    )

    chain.sleep(treasury.getMinDelay())

    governor.execute(
        [token],
        [0],
        [proposal_calldata],
        description_hash,
    )

    # Treasury should have transferred funds to payee.
    assert token.balanceOf(payee_account) == amount
    assert token.balanceOf(treasury) == 0

def test_treasury_alterations(chain, treasury, governor, accounts, admin, token):

    # New admin should not have access control by default.
    potential_admin = accounts[1]

    assert treasury.hasRole(treasury.TIMELOCK_ADMIN_ROLE(), potential_admin) == False

    # Access control alterations should not be able to bypass governance.
    with brownie.reverts():
        treasury.grantRole(treasury.TIMELOCK_ADMIN_ROLE(), potential_admin, {"from": potential_admin})

    # Delegate voting power to self before vote.
    token.delegate(admin, {"from": admin})

    # Create a proposal to add access.
    proposal_calldata = treasury.grantRole.encode_input(treasury.TIMELOCK_ADMIN_ROLE(), potential_admin)
    description = "Grant new admin"

    proposal_id = governor.propose(
        [treasury],
        [0],
        [proposal_calldata],
        description
    ).return_value    

    # Wait until the proposal becomes active.
    chain.mine(governor.votingDelay())

    # Cast 100% votes to succeed.
    governor.castVote(proposal_id, True, {"from": admin})

    # Wait for voting period to end.
    chain.mine(governor.votingPeriod())

    # Execute the proposal.
    description_hash = web3.keccak(text=description)

    governor.queue(
        [treasury],
        [0],
        [proposal_calldata],
        description_hash
    )

    chain.sleep(treasury.getMinDelay())

    governor.execute(
        [treasury],
        [0],
        [proposal_calldata],
        description_hash
    )

    assert treasury.hasRole(treasury.TIMELOCK_ADMIN_ROLE(), potential_admin) == True

def test_proposal_without_tokens(treasury, governor, token, accounts, admin):

    # A proposer with no tokens should not be able to submit a new governance proposal.
    proposer = accounts[1]

    assert token.balanceOf(proposer) == 0

    proposal_calldata = token.transfer.encode_input(proposer, 1000)

    with brownie.reverts("GovernorCompatibilityBravo: proposer votes below proposal threshold"):
        governor.propose(
            [token],
            [0],
            [proposal_calldata],
            "New Proposal",
            {"from": proposer}
        ) 

    # A proposer with delegated tokens should be able to submit a new governance proposal.
    token.transfer(proposer, governor.proposalThreshold(), {"from": admin})
    token.delegate(proposer, {"from": proposer})

    governor.propose(
        [token],
        [0],
        [proposal_calldata],
        "New Proposal",
        {"from": proposer}
    )
