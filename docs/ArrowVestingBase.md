# ArrowVestingBase



> Base implementation of vesting contract that will be cloned into individual vesting wallets pointing at specific beneficiary addresses.



*Although the contract inherits an upgradeable interface, the contract itself is not intended to be upgradeable; rather, it is intended to be cloned by `ArrowVestingFactory`.*

## Methods

### beneficiary

```solidity
function beneficiary() external view returns (address)
```



*Getter for the beneficiary address.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### duration

```solidity
function duration() external view returns (uint256)
```



*Getter for the vesting duration.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### initialize

```solidity
function initialize(address beneficiaryAddress, uint64 startTimestamp, uint64 durationSeconds) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| beneficiaryAddress | address | undefined |
| startTimestamp | uint64 | undefined |
| durationSeconds | uint64 | undefined |

### release

```solidity
function release(address token) external nonpayable
```



*Release the tokens that have already vested. Emits a {TokensReleased} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token | address | undefined |

### release

```solidity
function release() external nonpayable
```



*Release the native token (ether) that have already vested. Emits a {TokensReleased} event.*


### released

```solidity
function released() external view returns (uint256)
```



*Amount of eth already released*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### released

```solidity
function released(address token) external view returns (uint256)
```



*Amount of token already released*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### start

```solidity
function start() external view returns (uint256)
```



*Getter for the start timestamp.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### vestedAmount

```solidity
function vestedAmount(uint64 timestamp) external view returns (uint256)
```



*Calculates the amount of ether that has already vested. Default implementation is a linear vesting curve.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| timestamp | uint64 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### vestedAmount

```solidity
function vestedAmount(address token, uint64 timestamp) external view returns (uint256)
```



*Calculates the amount of tokens that has already vested. Default implementation is a linear vesting curve.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| token | address | undefined |
| timestamp | uint64 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |



## Events

### ERC20Released

```solidity
event ERC20Released(address indexed token, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| token `indexed` | address | undefined |
| amount  | uint256 | undefined |

### EtherReleased

```solidity
event EtherReleased(uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| amount  | uint256 | undefined |



