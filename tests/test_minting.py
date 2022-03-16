import pytest
import brownie

def test_mint(token, admin, accounts):
    
    # By default, the admin (deployer) account can mint tokens.
    amount = 1000

    amount_before = token.balanceOf(admin)

    token.mint(admin, amount, {"from": admin})

    amount_after = token.balanceOf(admin)

    assert amount_after - amount_before == amount

    # No other address can mint.
    with brownie.reverts("Ownable: caller is not the owner"):
        token.mint(accounts[1], amount, {"from": accounts[1]})

    assert token.balanceOf(accounts[1]) == 0

def test_mint_new_owner(token, admin, accounts):

    amount = 1000
    new_owner = accounts[1]

    # Transfer contract ownership.
    token.transferOwnership(new_owner)

    # Old owner should not be able to mint tokens.
    with brownie.reverts("Ownable: caller is not the owner"):
        token.mint(admin, amount, {"from": admin})

    # New owner should be able to mint tokens.
    amount_before = token.balanceOf(new_owner)

    token.mint(new_owner, amount, {"from": new_owner})

    amount_after = token.balanceOf(new_owner)

    assert amount_after - amount_before == amount
