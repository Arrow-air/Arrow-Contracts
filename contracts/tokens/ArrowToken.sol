// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Valid import paths for hardhat (need to comment out when using brownie)
// import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// For brownie tests (should remove once we fully move to hardhat)
import "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";
import "@openzeppelin-upgradeable/contracts/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin-upgradeable/contracts/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";
import "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";

/// @title Arrow Token implementation that is upgradeable
/// @notice Create ARROW tokens of an `initialSupply` amount
/// @dev If we were to upgrade the initializer by introducing new variables, we need to create a normal function like `initializeV2` (https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786/53), and make sure to include all existing variables from the current version of the contract to avoid storage collision
contract ArrowToken is
    Initializable,
    ERC20Upgradeable,
    AccessControlEnumerableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event ContractCreation(
        address indexed from,
        uint256 initialSupply,
        uint256 timestamp
    );
    event NewTokenIssurance(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );
    event TokenBurn(
        address indexed from,
        address indexed account,
        uint256 amount,
        uint256 timestamp
    );

    // implement the UUPS interface
    function _authorizeUpgrade(address) internal override onlyOwner {}

    ///@notice Mint an `_initialSupply` amount of tokens upon contract creation
    function initilize(uint256 _initialSupply) public initializer {
        __ERC20_init("Arrow", "ARROW");
        __Ownable_init();
        __UUPSUpgradeable_init();

        _mint(msg.sender, _initialSupply);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        emit ContractCreation(msg.sender, _initialSupply, block.timestamp);
    }

    /// @notice Mint and issue new tokens to a specified address
    /// @dev Only accepts calls from accounts with `MINTER_ROLE`.
    /// @param _to the address to issue new tokens to
    /// @param _amount the amount of tokens to be mint and transfered to `_to`
    function issueNewTokens(address _to, uint256 _amount)
        public
        onlyRole(MINTER_ROLE)
    {
        _mint(_to, _amount);
        emit NewTokenIssurance(msg.sender, _to, _amount, block.timestamp);
    }

    /// @notice Burn tokens from a specified account address
    /// @dev Only accepts calls from accounts with `BURNER_ROLE`.
    /// @param _from the address to burn tokens from
    /// @param _amount the amount of tokens to be burned
    function burnTokens(address _from, uint256 _amount)
        public
        onlyRole(BURNER_ROLE)
    {
        _burn(_from, _amount);
        emit TokenBurn(msg.sender, _from, _amount, block.timestamp);
    }

    function grantRole(address _to, bytes32 _role) public onlyRole(ADMIN_ROLE) {
        _grantRole(_role, _to);
    }

    function revokeRole(address _from, bytes32 _role)
        public
        onlyRole(ADMIN_ROLE)
    {
        _revokeRole(_role, _from);
    }
}
