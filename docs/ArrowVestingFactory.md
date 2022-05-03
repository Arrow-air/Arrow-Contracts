# ArrowVestingFactory



> Factory contract for creating vesting wallets from their base implementations





## Methods

### createVestingSchedule

```solidity
function createVestingSchedule(address beneficiaryAddress, uint64 startTimestamp, uint64 durationSeconds) external nonpayable returns (address clone)
```

Creates a new cloned vesting wallet from its base implementation. The wallet will initially be empty and should have appropriate ERC20 tokens and ETH transferred to it after creation



#### Parameters

| Name | Type | Description |
|---|---|---|
| beneficiaryAddress | address | The address of which the vesting is entitled to |
| startTimestamp | uint64 | The start time of the vesting schedule |
| durationSeconds | uint64 | Denotes the length of the vesting period |

#### Returns

| Name | Type | Description |
|---|---|---|
| clone | address | The address of the vesting wallet implemented by `ArrowVestingBase` |

### vestingImplementation

```solidity
function vestingImplementation() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |



## Events

### NewVestingAgreement

```solidity
event NewVestingAgreement(address beneficiaryAddress, uint64 startTimestamp, uint64 durationSeconds, address vestingWalletAddress)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| beneficiaryAddress  | address | undefined |
| startTimestamp  | uint64 | undefined |
| durationSeconds  | uint64 | undefined |
| vestingWalletAddress  | address | undefined |



