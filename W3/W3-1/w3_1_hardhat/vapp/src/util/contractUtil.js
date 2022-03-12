import {
	ethers
} from 'ethers';

import t20Addr from "../../../deployments/dev/goerli-T20.json";
import t20Abi from "../../../deployments/abi/T20.json";
import vaultAddr from "../../../deployments/dev/goerli-Vault.json";
import vaultAbi from "../../../deployments/abi/Vault.json";

//初始化提供者
export function initProviders() {
	let provider = new ethers.providers.Web3Provider(window.ethereum);

	return provider;
}

//初始化签名者
function initSigner() {
	let provider = initProviders();

	provider.send("eth_requestAccounts", []);

	const signer = provider.getSigner();

	return signer;
}

//根据hash（txId）获等待交易完成的结果
export function waitForTransaction(transactionHash) {
	let provider = initProviders();

	return new Promise((resolve, reject) => {
		provider.waitForTransaction(transactionHash).then((res) => {
			resolve(res);
		}).catch(err => {
			reject(err);
		});
	});
}

//获取当前钱包地址
export function getWalletAddress() {
	return new Promise((resolve, reject) => {
		let signer = initSigner();
		resolve(signer.getAddress());
	})
}

//获取网络信息
export function getNetworkInfo() {
	let provider = initProviders();
	return new Promise((resolve, reject) => {
		provider.getNetwork().then(res => {
			let newWorkInfo = NETWORKS[res.chainId];
			if (!newWorkInfo) {
				reject();
			}
			resolve(newWorkInfo);
		});
	})
}

//初始化 银行合约-只能操作只读的
function initVaultContract_readOnly() {
	let provider = initProviders();

	let vaultContract = new ethers.Contract(vaultAddr.address, vaultAbi.abi, provider);

	return vaultContract;
}

//初始化 银行合约-可以签名的
function initVaultContract_signer() {
	const signer = initSigner();

	let vaultContract = new ethers.Contract(vaultAddr.address, vaultAbi.abi, signer);

	return vaultContract;
}

//初始化 token合约-只能操作只读的
export function initTokenContract_readOnly() {
	let provider = initProviders();

	let tokenContract = new ethers.Contract(t20Addr.address, t20Abi.abi, provider);

	return tokenContract
}

//初始化 token合约-可以签名的
function initTokenContract_signer() {
	const signer = initSigner();

	let tokenContract = new ethers.Contract(t20Addr.address, t20Abi.abi, signer);

	return tokenContract;
}

/**
 * 代币余额
 */
export function t20Balance(addr) {
	const tokenContract = initTokenContract_readOnly();
	return new Promise((resolve, reject) => {
		tokenContract.balanceOf(addr).then(result => {
			return resolve(ethers.utils.formatEther(result))
		})
	})
}

/**
 * 代币总增发量
 */
 export function t20TotalSupply() {
	const tokenContract = initTokenContract_readOnly();
	return new Promise((resolve, reject) => {
		tokenContract.totalSupply().then(result => {
			return resolve(ethers.utils.formatEther(result))
		})
	})
}

/**
 * 增发
 */
export function t20Mint(addr, amount) {
	const tokenContract = initTokenContract_signer();
	return new Promise(async (resolve, reject) => {
		await tokenContract.mint(addr, ethers.utils.parseEther(amount)).then(result => {
			resolve(result.hash);
		}).catch(err => {
            console.log('err:',err)
            reject(err);
        });
	})
}

/**
 * 转账
 */
export function t20Transfer(addr, amount) {
	const tokenContract = initTokenContract_signer();
	return new Promise(async (resolve, reject) => {
		await tokenContract.transfer(addr, ethers.utils.parseEther(amount)).then(result => {
			resolve(result.hash);
		}).catch(err => {
            console.log('err:',err)
            reject(err);
        });
	})
}

/**
 * 查询授权金额
 */
 export function t20Allowance(owner, spender) {
	const tokenContract = initTokenContract_readOnly();
	return new Promise((resolve, reject) => {
		tokenContract.allowance(owner, spender).then(result => {
			return resolve(ethers.utils.formatEther(result))
		})
	})
}

/**
 * 授权
 */
 export function t20Approve(addr, amount) {
	const tokenContract = initTokenContract_signer();
	return new Promise(async (resolve, reject) => {
		await tokenContract.approve(addr, ethers.utils.parseEther(amount)).then(result => {
			resolve(result.hash);
		}).catch(err => {
            console.log('err:',err)
            reject(err);
        });
	})
}

/**
 * 查询存款
 */
export function getVaultBalance(addr) {
	const vaultContract = initVaultContract_readOnly();
	return new Promise((resolve, reject) => {
		vaultContract.userBalance(addr).then(result => {
			return resolve(ethers.utils.formatEther(result))
		})
	})
}

/**
 * 存款
 */
export function deposit(amount) {
	const vaultContract = initVaultContract_signer();
	return new Promise(async (resolve, reject) => {
		await vaultContract.deposit(ethers.utils.parseEther(amount)).then(result => {
			resolve(result.hash);
		}).catch(err => {
            console.log('err:',err)
            reject(err);
        });
	})
}

/**
 * 取款
 */
export function withdraw(amount) {
	const vaultContract = initVaultContract_signer();
	return new Promise(async (resolve, reject) => {
		await vaultContract.withdraw(ethers.utils.parseEther(amount)).then(result => {
			resolve(result.hash);
		}).catch(err => {
            console.log('err:',err)
            reject(err);
        });
	})
}
