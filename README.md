# Arrow Contracts

Implementation of the Arrow token and governance smart contracts.

## Installation

```bash
npm install
```

## Testing

To run the tests:

```bash
npm run test
```

## Deploying

To deploy on the public Rinkeby testnet:

1. Set up an [Infura development account](https://blog.infura.io/getting-started-with-infura-28e41844cc89/) and generate a PROJECT_ID.

2. Export the PROJECT_ID into your local environment.

```
export INFURA_PROJECT_ID=<PROJECT_ID>
```

3. Set up an Etherscan account and [generate an API key](https://etherscan.io/myapikey).

4. Export the ETHERSCAN_API_KEY to your local environment.

```
export ETHERSCAN_API_KEY=<ETHERSCAN_API_KEY>
```

5. Generate a new ethereum private key. This can be done via Metamask by creating a new account and [exporting the private key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).

6. Export the private key into your local environment.

```
export DEPLOYMENT_PRIVATE_KEY=<PRIVATE_KEY>
```

7. Make sure all tests are passing before deployment.

```
npx hardhat test
```

8. Run the deployment script to deploy the latest contracts to the testnet.

```
npx hardhat deploy --network rinkeby --tags Deployment
```

Deploying to mainnet is possible by subsituting all `--network rinkeby` arguments with `--network mainnet`.

## Upgrading

Upgrading contracts that are owned by a multisig should be proposed using [Defender](https://docs.openzeppelin.com/defender/guide-upgrades)

1. Sign up for a Defender account and generate an API key.

2. Export the API key and secret key into your local environment.

```
export DEFENDER_TEAM_API_KEY=<API_KEY>
export DEFENDER_TEAM_API_SECRET_KEY=<SECRET_KEY>
```

3. Export the addresses of the token proxy contract to be upgraded and the owning Gnosis multisig address.

```
export ARROW_TOKEN_PROXY_CONTRACT=<TOKEN_ADDRESS>
export ARROW_TOKEN_MUTISIG=<MULTISIG_ADDRESS>
```

4. Run the upgrade script to generate an upgrade proposal in Defender.

```
npx hardhat deploy --network rinkeby --tags Upgrade 
```

5. Use the multisig to approve and execute the upgrade proposal.

6. Verify the newly deployed implementation on Etherscan.

## Deployments

## Mainnet

| Contract            | Address                                    |
| ------------------- | ------------------------------------------ |
| Gnosis Safe         | 0x03b5Dc2CE78a7bEe9F66DD619b291595a2E166BB |
| ArrowToken          | 0x736609D310B5F925531B5ad895925CB0586F6241 |
| ArrowVestingFactory | 0xe774395857A91f7158FB0a79385c4C9F7975B848 |

### Rinkeby

| Contract            | Address                                    |
| ------------------- | ------------------------------------------ |
| Gnosis Safe         | 0x6943eBEfCD7d85B536aEb35BBFd95C5699158Abe |
| ArrowToken          | 0x0303e09191F692B5651a6Ab4b9953eC462CaBCB6 |
| ArrowVestingFactory | 0x7956CB406072750D625f764eE88De07A6e33066c |

## License

This project is licensed under the [MIT license](LICENSE).
