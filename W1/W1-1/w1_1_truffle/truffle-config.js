const HDWalletProvider = require('@truffle/hdwallet-provider');
var mnemonic = "...";

module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://exchaintestrpc.okex.org")
      },
      network_id: 65,
    }
  },
  contracts_build_directory: './src/contracts/',
  contracts_directory: './contracts/',
  compilers: {
    solc: {
      version: "^0.8.0",    //合约编译版本
    }
  }
};
