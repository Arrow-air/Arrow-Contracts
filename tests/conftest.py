#!/usr/bin/python3

import pytest
from brownie import Contract, interface

@pytest.fixture(scope="function", autouse=True)
def isolate(fn_isolation):
    # perform a chain rewind after completing each test, to ensure proper isolation
    # https://eth-brownie.readthedocs.io/en/v1.10.3/tests-pytest-intro.html#isolation-fixtures
    pass

@pytest.fixture(scope="module")
def admin(accounts):
    return accounts[0]

@pytest.fixture(scope="module")
def token(ArrowToken, admin):
    return ArrowToken.deploy(1e21, {'from': admin})

@pytest.fixture(scope="module")
def treasury(ArrowTreasury, admin):
    return ArrowTreasury.deploy(3, [], [], {'from': admin})

@pytest.fixture(scope="module")
def governor(MockArrowGovernor, token, admin, treasury):

    governor = MockArrowGovernor.deploy(token, treasury, {'from': admin})

    treasury.grantRole(treasury.PROPOSER_ROLE(), governor)
    treasury.grantRole(treasury.EXECUTOR_ROLE(), "0x0000000000000000000000000000000000000000")
    treasury.revokeRole(treasury.TIMELOCK_ADMIN_ROLE(), admin)

    return governor
    