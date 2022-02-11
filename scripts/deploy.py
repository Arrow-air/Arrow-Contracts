#!/usr/bin/python3

from brownie import ArrowToken, ArrowVestingFactory, accounts


def main(account = None):

    # Unlock the deployment address if none is supplied.
    if not account: 
        account = accounts.load("deployment_account")

    # Deploy token contract.
    token_initial_supply = 1e21

    token_contract = ArrowToken.deploy(token_initial_supply, {'from': account})

    print(f"Deployed token contract at {token_contract} with {token_initial_supply} supply.")
    print(f"Current contract owner: {token_contract.owner()}. This address currently controls minting capabilities.\n")

    ## Publish source if possible.
    try:
        ArrowToken.publish_source(token_contract, {'from': account})
    except:
        print("WARNING: contract source not published to Etherscan.")

    # Deploy vesting contracts.
    vesting_factory = ArrowVestingFactory.deploy({'from': account})

    print(f"Deployed vesting factory at {vesting_factory}.\n")

    ## Publish source if possible.
    try:
        ArrowVestingFactory.publish_source(vesting_factory, {'from': account})
    except:
        print("WARNING: contract source not published to Etherscan.")
