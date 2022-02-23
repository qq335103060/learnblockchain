async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());
    //销毁合约
    const OkTestToken = await ethers.getContractFactory("OkTestToken");
    const okTestToken = await OkTestToken.deploy(ethers.utils.parseEther('10000'), ethers.utils.parseEther('10000'));
    console.log("合约地址：", okTestToken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/deploy.js --network okextest