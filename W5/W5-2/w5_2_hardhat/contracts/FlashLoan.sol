// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.10;

import "./FlashLoanSimpleReceiverBase";
import "./interfaces/IPool";
import "./interfaces/IPoolAddressesProvider";
import "@openzeppelin/contracts/interfaces/IERC20.sol";


interface IV2SwapRouter{
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts); 
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IV3SwapRouter{
    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }
    function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut);
}

contract FlashLoan is FlashLoanSimpleReceiverBase {
    address v2Router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address v3Router = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address AtokenAddress = 0xBD633A791c4B95f7Daa81066f93CF23eE7E240e2;

    //测试网：PoolAddressesProvider:0xA55125A90d75a95EC00130E8E8C197dB5641Eb19
    constructor(address _addressProvider) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {}

    //借款单币种   DAI
    //DAI:0x2Ec4c6fCdBF5F9beECeB1b51848fc2DB1f3a26af
    function loanSimple(address _token ,uint256 _amount) public {
        bytes memory data = abi.encode(_token, _amount);
        IPool pool = IPool(ADDRESSES_PROVIDER.getPool());
        pool.flashLoanSimple(address(this), _token, _amount, data, 0);
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool){
        //借款数据
        (address borrowDai,) = abi.decode(params,(address,uint256));
        uint totalDebt = amount + premium;
        //使用借款的 DAI 在 Uniswap V2 中交易兑换 token A
        //授权
        IERC20(borrowDai).approve(v2Router, amount);
        address[] memory path1 = new address[](2);
        path1[0] = borrowDai;
        path1[1] = AtokenAddress;
        uint[] memory amounts1 = IV2SwapRouter(v2Router).swapExactTokensForTokens(amount,uint(0),path1,address(this),block.timestamp+2000);
        //amounts1[1] 兑换得到的Atoken
        //然后在 Uniswap V3 token A 兑换为 DAI
        //授权
        IERC20(AtokenAddress).approve(v3Router, amounts1[1]);
        // 开始兑换  uint256 v3DaiAmountOut
        IV3SwapRouter(v3Router).exactInput{value: 0}(
            IV3SwapRouter.ExactInputParams({
                path: abi.encodePacked(
                    AtokenAddress,
                    uint24(3000),
                    borrowDai
                ),
                recipient: address(this),
                deadline: block.timestamp + 2000,
                amountIn: amounts1[1],
                amountOutMinimum: 0
            })
        );
        //授权给Pool合约地址 还款
        IERC20(borrowDai).approve(ADDRESSES_PROVIDER.getPool(), totalDebt);
        return true;
    }
}