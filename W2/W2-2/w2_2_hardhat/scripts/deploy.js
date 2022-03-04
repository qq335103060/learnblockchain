const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());
    //学生合约
    const Score = await ethers.getContractFactory("Score");
    const score = await Score.deploy();
    //老师合约
    const Teacher = await ethers.getContractFactory("Teacher");
    const teacher = await Teacher.deploy(score.address);
    //等待部署完成
    await score.deployed();
    await teacher.deployed();
    console.log("学生合约地址：", score.address);
    console.log("老师合约地址：", teacher.address);
    //储存部署信息在文件
    let artifactScore = await artifacts.readArtifact("Score");
    await writeAbiAddr(artifactScore, score.address, "Score", network.name);
    let artifactTeacher = await artifacts.readArtifact("Teacher");
    await writeAbiAddr(artifactTeacher, teacher.address, "Teacher", network.name);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/deploy.js --network goerli