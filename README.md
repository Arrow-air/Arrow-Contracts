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

## Deployments

To deploy on the Optimism Kovan testnet:

```bash
npm run deployOptimismKovan
```

To deploy on `localhost`:

```bash
npx hardhat node
npx hardhat run --network localhost deploy/deployArrowTokenHot.js
```

### Rinkeby

| Contract    | Address                                    |
| ----------- | ------------------------------------------ |
| Gnosis Safe | 0x6943eBEfCD7d85B536aEb35BBFd95C5699158Abe |

## License

This project is licensed under the [MIT license](LICENSE).
