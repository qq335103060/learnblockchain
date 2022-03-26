const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());
     const MyTokenB = await ethers.getContractFactory("MyTokenB");
     const myTokenB = await MyTokenB.deploy();
    //等待部署完成
    await myTokenB.deployed();
    console.log("TokenB合约地址：", myTokenB.address);
    //储存部署信息在文件
    let artifact = await artifacts.readArtifact("MyTokenB");
    await writeAbiAddr(artifact, myTokenB.address, "MyTokenB", network.name);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/deploy_tokenb_2.js --network goerli