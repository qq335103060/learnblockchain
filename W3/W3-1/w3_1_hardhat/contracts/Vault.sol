// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
    address public tokenAddr;
    mapping(address => uint256) public userBalance;

    constructor(address _tokenAddr) {
        tokenAddr = _tokenAddr;
    }

    function deposit(uint256 _amount) public {
        require(
            IERC20(tokenAddr).transferFrom(msg.sender, address(this), _amount),
            "TransferFrom failed"
        );
        userBalance[msg.sender] += _amount;
    }

    function withdraw(uint256 _amount) public {
        require(
            userBalance[msg.sender] >= _amount && _amount > 0,
            "Sorry, your credit is running low"
        );
        userBalance[msg.sender] -= _amount;
        require(
            IERC20(tokenAddr).transfer(msg.sender, _amount),
            "Transfer failed"
        );
    }
}
