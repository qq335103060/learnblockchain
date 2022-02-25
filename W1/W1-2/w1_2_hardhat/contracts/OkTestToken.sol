// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract OkTestToken is ERC20("OKT Test Token", "OTT"), Ownable {
    using SafeMath for uint256;
    //1开始  2关闭
    uint256 private exchangeState = 1;

    //x * y = k
    //储备1  x
    uint256 public reserve0;

    //储备2  y
    uint256 public reserve1;

    //修饰符：防止重入的开关
    uint256 private unlocked = 1;

    //防止重入   相当于锁
    modifier lock() {
        require(unlocked == 1, "Frequent operation");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    constructor(uint256 _reserve0, uint256 _reserve1) {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
    }

    //总量1000000000000   乘方 **    先乘方    10亿    固定数量
    uint256 _tTotal = 1 * 10**9 * 10**18;

    //铸币
    function mint(address _to) public onlyOwner {
        //转移全部代币
        _mint(_to, _tTotal);
    }

    //代币销毁
    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }

    //合约管理员转移
    function passMinterRole(address newOwner)
        external
        onlyOwner
        returns (bool)
    {
        transferOwnership(newOwner);
        return true;
    }

    //修改合约兑换状态
    function updateExchangeState(uint256 _state) public onlyOwner {
        exchangeState = _state;
    }

    //通过in计算out   amountIn输入购买数量      reserveIn输入储备    reserveOut输出储备     返回输出数量
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) private pure returns (uint256 amountOut) {
        require(amountIn > 0, "UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
        );
        uint256 numerator = amountIn.mul(reserveOut);
        uint256 denominator = reserveIn.add(amountIn);
        amountOut = numerator / denominator;
    }

    //通过out 计算in (后面详细说明)
    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256 amountIn) {
        require(amountOut > 0, "UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT");
        require(
            reserveIn > 0 && reserveOut > 0,
            "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
        );
        uint256 numerator = reserveIn.mul(amountOut);
        uint256 denominator = reserveOut.sub(amountOut);
        amountIn = (numerator / denominator).add(1);
    }

    //输入准确Atoken的数量获得Btoken的数量
    function swapExactTokensForTokens() external payable {
        //能兑换到的代币
        uint256 amounts = getAmountOut(msg.value, reserve0, reserve1);
        //开始转账
        // transfer(msg.sender, amounts);
        _transfer(address(this), msg.sender, amounts);
        reserve1 = reserve1.sub(amounts);
    }
}
