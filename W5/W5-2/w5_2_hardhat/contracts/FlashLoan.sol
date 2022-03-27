// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.10;

import "./FlashLoanSimpleReceiverBase";
import "./interfaces/IPool";
import "./interfaces/IPoolAddressesProvider";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase {
    //测试网：PoolAddressesProvider:0xBA6378f1c1D046e9EB0F538560BA7558546edF3C
    constructor(address _addressProvider)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {}

    //借款单币种
    function loanSimple(address _asset, uint256 _amount) public {
        IPool pool = IPool(ADDRESSES_PROVIDER.getPool());
        pool.flashLoanSimple(address(this), _asset, _amount, "", 0);
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool) {
        uint256 totalDebt = amount + premium;
        //执行作业一流程
        //授权给Pool合约地址 还款
        IERC20(asset).approve(ADDRESSES_PROVIDER.getPool(), totalDebt);
        return true;
    }
}
