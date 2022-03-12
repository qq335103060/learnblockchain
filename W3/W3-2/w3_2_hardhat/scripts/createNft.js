const { ethers, network } = require('hardhat');
const w32NFT = require(`../deployments/dev/${network.name}-W32NFT.json`);

async function main() {
  const [deployer] = await ethers.getSigners();
  let nft = await ethers.getContractAt(w32NFT.contractName, w32NFT.address, deployer);
  await nft.addNft(deployer.address,"https://gateway.pinata.cloud/ipfs/QmXw34zASB72ALxSdBZufmQkbVvt39tycDh4gV984NDeAe");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});

//npx hardhat run scripts/createNft.js --network goerli