
import pytest

import brownie
from brownie import Contract

def test_vesting(ArrowVestingBase, chain, token, vestingFactory, accounts):

    beneficiary = accounts[1]
    startTimestamp = chain.time() + 100
    durationSeconds = 100
    amount = 1000

    # Create a new vesting schedule.
    vestingWalletTx = vestingFactory.createVestingSchedule(beneficiary, startTimestamp, durationSeconds)
    vestingContract = ArrowVestingBase.at(vestingWalletTx.return_value)

    # Add tokens to the contract.
    token.transfer(vestingContract, amount)

    assert token.balanceOf(vestingContract) == amount

    # Check contract variables have been set correctly.
    assert vestingContract.start() == startTimestamp
    assert vestingContract.duration() == durationSeconds
    assert vestingContract.released(token) == 0

    # No tokens should have been immediately released.
    assert token.balanceOf(beneficiary) == 0

    vestingContract.release(token, {"from": beneficiary})

    assert token.balanceOf(beneficiary) == 0

    # No tokens should have been released before the end of the vesting cliff.
    chain.mine(1, timestamp=startTimestamp)
    tx = vestingContract.release(token, {"from": beneficiary})

    assert token.balanceOf(beneficiary) == amount * (tx.timestamp - startTimestamp) / durationSeconds

    # Half the tokens should be vested when half the vesting duration has elapsed.
    chain.mine(1, timestamp=(startTimestamp + int(durationSeconds / 2)))
    tx = vestingContract.release(token, {"from": beneficiary})

    assert token.balanceOf(beneficiary) == amount * (tx.timestamp - startTimestamp) / durationSeconds

    # All tokens should be vested when the vesting duration has elapsed.
    chain.mine(1, timestamp=(startTimestamp + durationSeconds))
    vestingContract.release(token, {"from": beneficiary})

    assert token.balanceOf(beneficiary) == amount    

def test_multiple_vestings(ArrowVestingBase, chain, token, vestingFactory, accounts):

    # Create multiple vesting contracts.
    beneficiaryOne = accounts[1]
    startTimestampOne = chain.time() + 200
    durationOne = 100
    amountOne = 1000

    tx = vestingFactory.createVestingSchedule(beneficiaryOne, startTimestampOne, durationOne)
    vestingOne = ArrowVestingBase.at(tx.return_value)

    beneficiaryTwo = accounts[2]
    startTimestampTwo = chain.time() + 250
    durationTwo = 200
    amountTwo = 2000

    tx = vestingFactory.createVestingSchedule(beneficiaryTwo, startTimestampTwo, durationTwo)
    vestingTwo = ArrowVestingBase.at(tx.return_value)

    assert token.balanceOf(beneficiaryOne) == 0
    assert token.balanceOf(beneficiaryTwo) == 0

    # Load contracts with tokens.
    token.transfer(vestingOne, amountOne)
    token.transfer(vestingTwo, amountTwo)

    assert token.balanceOf(vestingOne) == amountOne
    assert token.balanceOf(vestingTwo) == amountTwo

    # Release should vest no tokens before start.
    chain.mine(1, timestamp=startTimestampOne)

    vestingOne.release(token, {"from": beneficiaryOne})
    vestingTwo.release(token, {"from": beneficiaryTwo})

    assert token.balanceOf(beneficiaryOne) == 0
    assert token.balanceOf(beneficiaryTwo) == 0

    # Token releases should occur at appropriate times.
    
    # Start of first vesting.
    chain.mine(1, timestamp=startTimestampTwo)

    txOne = vestingOne.release(token, {"from": beneficiaryOne})
    txTwo = vestingTwo.release(token, {"from": beneficiaryTwo})

    assert token.balanceOf(beneficiaryOne) == amountOne * ((txOne.timestamp - startTimestampOne) / durationOne)
    assert token.balanceOf(beneficiaryTwo) == amountTwo * ((txTwo.timestamp - startTimestampTwo) / durationTwo)

    ## End of first vesting.
    chain.mine(1, timestamp=startTimestampOne + durationOne)

    txOne = vestingOne.release(token, {"from": beneficiaryOne})
    txTwo = vestingTwo.release(token, {"from": beneficiaryTwo})

    assert token.balanceOf(beneficiaryOne) == amountOne
    assert token.balanceOf(beneficiaryTwo) == amountTwo * ((txTwo.timestamp - startTimestampTwo) / durationTwo)

    ## End of second vesting.
    chain.mine(1, timestamp=startTimestampTwo + durationTwo)

    vestingOne.release(token, {"from": beneficiaryOne})
    vestingTwo.release(token, {"from": beneficiaryTwo})

    assert token.balanceOf(beneficiaryOne) == amountOne
    assert token.balanceOf(beneficiaryTwo) == amountTwo
