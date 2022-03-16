const { ethers, network } = require('hardhat');
const myTokenMarket = require(`../deployments/dev/${network.name}-MyTokenMarket.json`);

async function main() {
  const [deployer] = await ethers.getSigners();
  let tokenMarket = await ethers.getContractAt(myTokenMarket.contractName, myTokenMarket.address, deployer);
  //增加流动性
  await tokenMarket.AddLiquidity(ethers.utils.parseEther('100'), {value : ethers.utils.parseEther('0.001')});
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/add_liquidity_7.js --network goerli