const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());
    //部署合约
    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy();
    //等待部署完成
    await bank.deployed();
    console.log("合约地址：", bank.address);
    //储存部署信息在文件
    let artifact = await artifacts.readArtifact("Bank");
    await writeAbiAddr(artifact, bank.address, "Bank", network.name);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/deploy.js --network goerli