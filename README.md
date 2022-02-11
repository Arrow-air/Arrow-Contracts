# Arrow Contracts

Implementation of the Arrow token and governance smart contracts.

## Installation

1. [Install Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html), if you haven't already.

## Testing

To run the tests:

```bash
brownie test
```

## Deploying

To deploy contracts on the Rinkeby testnet:

1. Generate a new deployment account.

```
brownie accounts generate deployment_account
```

2. Set up an [Infura development account](https://blog.infura.io/getting-started-with-infura-28e41844cc89/) and generate a PROJECT_ID.

3. Export the PROJECT_ID into your local environment.

```
export WEB3_INFURA_PROJECT_ID=<PROJECT_ID>
```

4. Load enough ETH into your deployment account for contract deployments to succeed.

5. Run the deployment script.

```
brownie run scripts/deploy.py --network rinkeby
```

6. Sign up for an Etherscan account, generate an API token, and export it into your local environment.

```
export ETHERSCAN_TOKEN=<ETHERSCAN API TOKEN>
```

7. Publish contract sources to Etherscan.


Mainnet deployments can proceed by following the same steps, replacing `--network rinkeby` with `--network mainnet`.


## Deployments

### Rinkeby

| Contract | Address |
| -- | -- |
| Gnosis Safe | 0x6943eBEfCD7d85B536aEb35BBFd95C5699158Abe |
| ArrowToken | 0x49eD1A01Ed28E1d0E165C85726e8c109A49e4E77 | 
| ArrowVestingFactory | 0x705B85358071f32B282483556778E375Fc530650 |

## License

This project is licensed under the [MIT license](LICENSE).
