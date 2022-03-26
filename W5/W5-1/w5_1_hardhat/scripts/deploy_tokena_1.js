const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());
     const MyTokenA = await ethers.getContractFactory("MyTokenA");
     const myTokenA = await MyTokenA.deploy();
    //等待部署完成
    await myTokenA.deployed();
    console.log("TokenA合约地址：", myTokenA.address);
    //储存部署信息在文件
    let artifact = await artifacts.readArtifact("MyTokenA");
    await writeAbiAddr(artifact, myTokenA.address, "MyTokenA", network.name);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/deploy_tokena_1.js --network goerli