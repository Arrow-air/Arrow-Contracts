# Arrow Contracts

Implementation of the Arrow token and governance smart contracts.

## Get Started

```bash
npm install
```

## Testing

```bash
npm run test
```

## Deployments

To deploy on the Optimism Kovan testnet:

```bash
npm run deployOptimismKovan
```

To deploy on `localhost`:

```bash
npx hardhat node
npx hardhat run --network localhost scripts/deployToken.js
```

### Testnet Addresses

| Contract                        | Address                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Optimism Kovan (proxy contract) | [0x9ea5F910e4579d9dfCc6ed2fb11C591F6ed6c5a8](https://kovan-optimistic.etherscan.io/address/0x9ea5F910e4579d9dfCc6ed2fb11C591F6ed6c5a8#code) |

## License

This project is licensed under the [MIT license](LICENSE).
