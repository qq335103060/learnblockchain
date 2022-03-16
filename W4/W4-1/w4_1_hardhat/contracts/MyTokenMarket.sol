// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Router {
    function addLiquidityETH(
        address token, //token地址
        uint256 amountTokenDesired, //预期支付代币的数量
        uint256 amountTokenMin, //用户可接受的最小成交数量
        uint256 amountETHMin, //用户可接受的最小成交数量
        address to, //接收流动性代币的地址
        uint256 deadline //该笔交易的有效时间
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );

    function swapExactETHForTokens(
        uint256 amountOutMin, //最低输出金额
        address[] calldata path, //兑换路径
        address to, //兑换以后给谁
        uint256 deadline //过期时间
    ) external payable returns (uint256[] memory amounts);
}

contract MyTokenMarket {
    address public routerAddress;
    address public myToken;
    address public wethAddress;

    constructor(
        address _router,
        address _token,
        address _weth
    ) {
        routerAddress = _router;
        myToken = _token;
        wethAddress = _weth;
        //授权给路由合约
        IERC20(myToken).approve(routerAddress, ~uint256(0));
    }

    function AddLiquidity(uint256 _amountTokenDesired) public payable {
        IERC20(myToken).transferFrom(
            msg.sender,
            address(this),
            _amountTokenDesired
        );
        //开始添加流动性
        IUniswapV2Router(routerAddress).addLiquidityETH{value: msg.value}(
            myToken,
            _amountTokenDesired,
            1,
            1,
            msg.sender,
            9000000000
        );
    }

    function buyToken() public payable returns (uint256[] memory amounts) {
        address[] memory path = new address[](2);
        path[0] = wethAddress;
        path[1] = myToken;
        //不考虑滑点问题
        amounts = IUniswapV2Router(routerAddress).swapExactETHForTokens{
            value: msg.value
        }(0, path, msg.sender, 9000000000);
    }
}
