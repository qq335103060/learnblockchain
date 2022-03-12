const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());
     //代币合约
     const Token = await ethers.getContractFactory("T20");
     const token = await Token.deploy();
     //银行合约
     const Vault = await ethers.getContractFactory("Vault");
     const vault = await Vault.deploy(token.address);
    //等待部署完成
    await token.deployed();
    await vault.deployed();
    console.log("代币合约地址：", token.address);
    console.log("银行合约地址：", vault.address);
    //储存部署信息在文件
    let artifactT20 = await artifacts.readArtifact("T20");
    await writeAbiAddr(artifactT20, token.address, "T20", network.name);
    let artifactVault = await artifacts.readArtifact("Vault");
    await writeAbiAddr(artifactVault, vault.address, "Vault", network.name);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/deploy.js --network goerli