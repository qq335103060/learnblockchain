const { ethers, network } = require('hardhat');
const OkTestToken = require(`../deployments/dev/${network.name}-OkTestToken.json`);


async function main() {
  const [deployer] = await ethers.getSigners();
  //获取合约实例
  let okTestToken = await ethers.getContractAt(OkTestToken.contractName, OkTestToken.address, deployer);
  console.log("合约代币名称：", await okTestToken.name());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/getName.js --network okextest