const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')

const myToken = require(`../deployments/dev/${network.name}-MyToken.json`);
const uniswapV2Router = require(`../deployments/dev/${network.name}-UniswapV2Router02.json`);
const wETH9 = require(`../deployments/dev/${network.name}-WETH9.json`);

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());
     const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
     const myTokenMarket = await MyTokenMarket.deploy(uniswapV2Router.address, myToken.address, wETH9.address);
    //等待部署完成
    await myTokenMarket.deployed();
    console.log("myTokenMarket合约地址：", myTokenMarket.address);
    //储存部署信息在文件
    let artifact = await artifacts.readArtifact("MyTokenMarket");
    await writeAbiAddr(artifact, myTokenMarket.address, "MyTokenMarket", network.name);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/deploy_my_token_market_5.js --network goerli