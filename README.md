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


*Note: You may need to run `npx hardhat clean` to clear all the build caches and artifacts if you encounter "no such file or directory" issues when verifying contracts (also see [here](https://github.com/NomicFoundation/hardhat/issues/1117)).*

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

### Mainnet

| Contract            | Address                                    |
| ------------------- | ------------------------------------------ |
| Gnosis Safe         | 0x03b5Dc2CE78a7bEe9F66DD619b291595a2E166BB |
| ArrowToken          | 0x736609D310B5F925531B5ad895925CB0586F6241 |

### Optimism

| Contract            | Address                                    |
| ------------------- | ------------------------------------------ |
| Gnosis Safe         | 0xaDc17e5f0e9F755C717B2beE43B590260034b852 |
| ArrowToken          | 0x78b3C724A2F663D11373C4a1978689271895256f |
| ArrowVestingFactory | 0x736609D310B5F925531B5ad895925CB0586F6241 |

### Rinkeby

| Contract            | Address                                    |
| ------------------- | ------------------------------------------ |
| Gnosis Safe         | 0x6943eBEfCD7d85B536aEb35BBFd95C5699158Abe |
| ArrowToken          | 0x0303e09191F692B5651a6Ab4b9953eC462CaBCB6 |

### Kovan

| Contract            | Address                                    |
| ------------------- | ------------------------------------------ |
| ArrowToken          | 0x736609D310B5F925531B5ad895925CB0586F6241 |

### Optimistic Kovan

| Contract            | Address                                    |
| ------------------- | ------------------------------------------ |
| ArrowToken          | 0xF16Bf805EBA1658a02FDEf9BD78f6402B74F0ED9 |
| ArrowVestingFactory | 0x2b5098e7315e0a03bcde84f0bbe3bfe794e4cfa7 |

## License

This project is licensed under the [MIT license](LICENSE).
