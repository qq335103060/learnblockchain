require("@nomiclabs/hardhat-waffle");
//账号秘钥
const ROPSTEN = "...";
module.exports = {
  //部署网络
  defaultNetwork: "hardhat",
  networks: {
    okextest: {
      url: `https://exchaintestrpc.okex.org`,
      accounts: [`0x${ROPSTEN}`],
      chainId: 65
    }
  },
  solidity: {
    // 编译版本
    compilers: [
      {
        version: "0.8.12",
        settings: {}
      },
    ]
  },
  //编译以后的文件路径
  paths: {
    // 合约来源
    sources: "./contracts",
    // 测试文件
    tests: "./test",
    // 缓存目录
    cache: "./cache",
    // 编译目录
    artifacts: "./artifacts"
  }
};

//npx hardhat flatten contracts/OkTestToken.sol >> OkTestToken.sol