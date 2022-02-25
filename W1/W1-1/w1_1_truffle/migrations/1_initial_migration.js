const okTestToken = artifacts.require("OkTestToken");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(okTestToken, web3.utils.toWei('1000', 'ether'), web3.utils.toWei('1000', 'ether'));
  //获取合约实例
  const okTest = await okTestToken.deployed();
};