import pytest

import scripts.deploy as deploy

def test_deployment(ArrowToken, ArrowVestingFactory, accounts, history):
    
    # Run the deployment script.
    deployment_account = accounts[1]
    
    deploy.main(deployment_account)

    # Contracts should have been deployed.
    vesting_contract = ArrowVestingFactory.at(history[-1].contract_address)
    token_contract = ArrowToken.at(history[-2].contract_address)

    # Deployment account should be owner of the token contract.
    assert token_contract.owner() == deployment_account
    
    # All minted tokens should have been sent to deployment account.
    assert token_contract.balanceOf(deployment_account) == 1e21
