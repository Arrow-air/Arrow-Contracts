#!/usr/bin/python3

from brownie import accounts


def main():
    return ArrowToken.deploy(1e21, {'from': accounts[0]})
