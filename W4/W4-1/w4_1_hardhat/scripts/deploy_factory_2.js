const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());

     const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
     const uniswapV2Factory = await UniswapV2Factory.deploy("0x0000000000000000000000000000000000000000");
    //等待部署完成
    await uniswapV2Factory.deployed();
    console.log("Factory合约地址：", uniswapV2Factory.address);
    console.log("INIT_CODE_PAIR_HASH(修改到路由合约pairFor的hax)：", await uniswapV2Factory.INIT_CODE_PAIR_HASH());
    
    //储存部署信息在文件
    let artifact = await artifacts.readArtifact("UniswapV2Factory");
    await writeAbiAddr(artifact, uniswapV2Factory.address, "UniswapV2Factory", network.name);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/deploy_factory_2.js --network goerli