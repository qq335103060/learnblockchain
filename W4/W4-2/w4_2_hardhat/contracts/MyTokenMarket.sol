// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Router {
    function swapExactETHForTokens(
        uint256 amountOutMin, //最低输出金额
        address[] calldata path, //兑换路径
        address to, //兑换以后给谁
        uint256 deadline //过期时间
    ) external payable returns (uint256[] memory amounts);
}

interface IMasterChef {
    function deposit(uint256 _pid, uint256 _amount) external;

    function withdraw(uint256 _pid, uint256 _amount) external;
}

contract MyTokenMarket {
    address public routerAddress;
    address public myToken;
    address public wethAddress;
    address public masterChefAddress;

    constructor(
        address _router,
        address _token,
        address _weth,
        address _masterChef
    ) {
        routerAddress = _router;
        myToken = _token;
        wethAddress = _weth;
        masterChefAddress = _masterChef;
        //授权给路由合约
        IERC20(myToken).approve(routerAddress, ~uint256(0));
    }

    function buyToken() public payable {
        address[] memory path = new address[](2);
        path[0] = wethAddress;
        path[1] = myToken;
        //不考虑滑点问题
        uint256[] memory amounts = IUniswapV2Router(routerAddress)
            .swapExactETHForTokens{value: msg.value}(
            0,
            path,
            address(this),
            9000000000
        );
        //添加到质押池
        IERC20(myToken).approve(masterChefAddress, ~uint256(0));
        IMasterChef(masterChefAddress).deposit(0, amounts[1]);
    }

    //提取质押
    function withdraw(uint256 _amounts) public {
        IMasterChef(masterChefAddress).withdraw(0, _amounts);
    }
}
