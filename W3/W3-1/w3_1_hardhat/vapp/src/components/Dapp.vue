<template>
  <div>
    <div v-if="walletIsConnected">
      <div>ERC20代币总增发量：{{ t20TotalSupply }}</div>
      <div>
        <input
          placeholder="增发代币给谁"
          v-model="onAdditionalAddr"
          style="width: 40%"
        />&nbsp;<input
          placeholder="增发数量"
          v-model="onAdditionalCount"
          style="width: 12%"
        />&nbsp;<button @click="onAdditionalT20">增 发</button>
      </div>
      <br /><br />
      👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻👨🏻
      <div>用户钱包地址：{{ accountAddress }}</div>
      <div>用户ERC20代币余额：{{ t20Balance }}</div>
      <div>
        <input
          placeholder="转账代币给谁"
          v-model="onTransferAddr"
          style="width: 40%"
        />&nbsp;<input
          placeholder="转账数量"
          v-model="onTransferCount"
          style="width: 12%"
        />&nbsp;<button @click="onTransferT20">转 账</button>
      </div>
      <br /><br />
      🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦🏦
      <div>用户🏦存款余额：{{ vaultBalance }}</div>
      <div>
        <input
          placeholder="存款数量"
          v-model="onDepositCount"
          style="width: 20%"
        />&nbsp;<button @click="t20Allowance">存款到合约</button>
      </div>
      <div>
        <input
          placeholder="取款数量"
          v-model="onWithdrawCount"
          style="width: 20%"
        />&nbsp;<button @click="onWithdrawT20">从合约取款</button>
      </div>
    </div>
    <div v-else @tap="connectWallet">
      <template v-if="!notConnectedWalletError"> 请链接钱包 </template>
    </div>
  </div>
</template>

<script>
import {
  initProviders,
  getWalletAddress,
  t20Balance,
  t20TotalSupply,
  t20Mint,
  getVaultBalance,
  waitForTransaction,
  t20Transfer,
  t20Allowance,
  t20Approve,
  deposit,
  withdraw,
} from "@/util/contractUtil.js";

import vaultAddr from "../../../deployments/dev/goerli-Vault.json";

export default {
  name: "Dapp",
  mounted() {
    this.initData();
  },
  data() {
    return {
      accountAddress: "",
      notConnectedWalletError: false,
      walletIsConnected: false,
      mintMsg: null,
      transferMsg: null,
      approvMsg: null,
      depositMsg: null,
      withdrawMsg: null,
      t20Balance: 0,
      t20TotalSupply: 0,
      vaultBalance: 0,
      onAdditionalCount: null,
      onAdditionalAddr: null,
      onTransferCount: null,
      onTransferAddr: null,
      onDepositCount: null,
      onWithdrawCount: null,
    };
  },
  beforeCreate() {},
  components: {},
  async created() {},
  methods: {
    initData() {
      //判断是否钱包环境
      try {
        initProviders();
      } catch (err) {
        //环境不存在
        this.notConnectedWalletError = true;
        return;
      }
      //获取钱包地址
      this.getWalletAddress();
    },
    getVaultBalance() {
      getVaultBalance(this.accountAddress).then((res) => {
        this.vaultBalance = res;
      });
    },
    getT20TotalSupply() {
      t20TotalSupply().then((res) => {
        this.t20TotalSupply = res;
      });
    },
    getT20Balance() {
      t20Balance(this.accountAddress).then((res) => {
        this.t20Balance = res;
      });
    },
    //获取钱包地址
    async getWalletAddress() {
      getWalletAddress().then(async (res) => {
        this.accountAddress = res;
        this.walletIsConnected = true;
        //查询余额
        this.getT20TotalSupply();
        this.getT20Balance();
        this.getVaultBalance();
      });
    },
    connectWallet() {
      this.initData();
    },
    onWithdrawT20() {
      withdraw(this.onWithdrawCount).then((hash) => {
        //取款提交成功
        this.withdrawMsg = this.$message({
          message: "取款提交成功,[" + hash + "]",
          type: "loading",
          hasMask: true,
          position: "top-right",
          showClose: true,
        });
        this.listenerResult(hash, this.withdrawMsg);
      });
    },
    onDepositT20(onDepositCount) {
      deposit(onDepositCount).then((hash) => {
        //存款提交成功
        this.depositMsg = this.$message({
          message: "存款提交成功,[" + hash + "]",
          type: "loading",
          hasMask: true,
          position: "top-right",
          showClose: true,
        });
        this.listenerResult(hash, this.depositMsg);
      });
    },
    t20Allowance() {
      t20Allowance(this.accountAddress, vaultAddr.address).then((res) => {
        if (res >= this.onDepositCount) {
          //存款
          this.onDepositT20(this.onDepositCount);
        } else {
          //授权
          this.t20Approve(vaultAddr.address, this.onDepositCount);
        }
      });
    },
    t20Approve(addr, amount) {
      t20Approve(addr, amount).then((hash) => {
        //授权提交成功
        this.approvMsg = this.$message({
          message: "授权提交成功,[" + hash + "]",
          type: "loading",
          hasMask: true,
          position: "top-right",
          showClose: true,
        });
        this.listenerResult(hash, this.approvMsg);
      });
    },
    onTransferT20() {
      t20Transfer(this.onTransferAddr, this.onTransferCount).then((hash) => {
        //转账提交成功
        this.transferMsg = this.$message({
          message: "转账提交成功,[" + hash + "]",
          type: "loading",
          hasMask: true,
          position: "top-right",
          showClose: true,
        });
        this.listenerResult(hash, this.transferMsg);
      });
    },
    onAdditionalT20() {
      t20Mint(this.onAdditionalAddr, this.onAdditionalCount).then((hash) => {
        //增发提交成功
        this.mintMsg = this.$message({
          message: "增发提交成功,[" + hash + "]",
          type: "loading",
          hasMask: true,
          position: "top-right",
          showClose: true,
        });
        this.listenerResult(hash, this.mintMsg);
      });
    },
    listenerResult(hash, msg) {
      waitForTransaction(hash)
        .then((res) => {
          msg.close();
          if (res.status == 1) {
            this.$message({
              message: "交易成功，交易ID：" + hash,
              type: "success",
              showClose: true,
              duration: 10000,
            });
            //刷新余额
            this.getWalletAddress();
          } else {
            //失败
            this.$message({
              message: "交易失败，交易ID：" + hash,
              type: "error",
              showClose: true,
              duration: 10000,
            });
          }
        })
        .catch((err) => {
          msg.close();
          this.transferMsg.close();
          //失败
          this.$message({
            message: "交易失败" + err,
            type: "error",
            showClose: true,
            duration: 10000,
          });
        });
    },
  },
};
</script>