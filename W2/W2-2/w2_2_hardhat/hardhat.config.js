require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
//账号秘钥
const ROPSTEN = "...";
module.exports = {
  //部署网络
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
      accounts: [`0x${ROPSTEN}`],
      chainId: 5
    }
  },
  etherscan: {
    apiKey: ""
  },
  solidity: {
    // 编译版本
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
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