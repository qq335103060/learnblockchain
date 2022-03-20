const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
const sushiToken = require(`../deployments/dev/${network.name}-SushiToken.json`);

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());
     const MasterChef = await ethers.getContractFactory("MasterChef");
     //没有奖励区块，，手续费直接打到0x6D305b56376c3418Ea3bc0c5BF9CFC95bDec9183地址
     const masterChef = await MasterChef.deploy(sushiToken.address,"0x6D305b56376c3418Ea3bc0c5BF9CFC95bDec9183",ethers.utils.parseEther('40'),0,6568146);
    //等待部署完成
    await masterChef.deployed();
    console.log("masterChef合约地址：", masterChef.address);
    
    //储存部署信息在文件
    let artifact = await artifacts.readArtifact("MasterChef");
    await writeAbiAddr(artifact, masterChef.address, "MasterChef", network.name);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/deploy_master_chef_2.js --network goerli