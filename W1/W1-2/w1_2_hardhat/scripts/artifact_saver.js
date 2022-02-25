const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

async function writeAbiAddr(artifacts, addr, name, network){
    const deployments = {};
    deployments["address"] = addr;
    deployments["contractName"] = artifacts.contractName;
    const deploymentDevPath = path.resolve(__dirname, `../deployments/dev/${network}-${deployments["contractName"]}.json`);
    await writeFile(deploymentDevPath, JSON.stringify(deployments, null, 2));

    const abis = {};
    abis["contractName"] = artifacts.contractName;
    abis["abi"] = artifacts.abi;
    const deploymentAbiPath = path.resolve(__dirname, `../deployments/abi/${abis["contractName"]}.json`);
    await writeFile(deploymentAbiPath, JSON.stringify(abis, null, 2));
}

module.exports = { writeAbiAddr };