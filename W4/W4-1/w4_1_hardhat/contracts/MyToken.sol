// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// W4_1作业
// * 部署自己的 ERC20 合约 MyToken
// * 编写合约 MyTokenMarket 实现：
//    * AddLiquidity():函数内部调用 UniswapV2Router 添加 MyToken 与 ETH 的流动性
//    * buyToken()：用户可调用该函数实现购买 MyToken

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MT20") {}

    //无限增发
    function mint(address _account, uint256 _amount) public returns (bool) {
        _mint(_account, _amount);
        return true;
    }
}
