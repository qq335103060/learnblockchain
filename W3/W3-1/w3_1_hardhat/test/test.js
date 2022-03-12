const { expect } = require("chai");

let token;
let vault;
let owner;
let addr1;
let addr2;
beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    //代币合约
    const Token = await ethers.getContractFactory("T20");
    token = await Token.deploy();
    //银行合约
    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(token.address);
});

describe("Token", function () {
    it("token mint transfer", async function () {
        //铸币
        await token.mint(addr1.address, ethers.utils.parseEther('100'));
        expect(ethers.utils.formatEther(await token.balanceOf(addr1.address))).to.equal("100.0");
        //转账  
        await token.connect(addr1).transfer(addr2.address,ethers.utils.parseEther('50'));
        expect(ethers.utils.formatEther(await token.balanceOf(addr2.address))).to.equal("50.0");
    });
});

describe("Vault", function () {
    it("deposit", async function () {
        //存款
        await token.mint(addr1.address, ethers.utils.parseEther('100'));
        await token.connect(addr1).approve(vault.address, ethers.utils.parseEther('100'));
        await vault.connect(addr1).deposit(ethers.utils.parseEther('100'));
        expect(ethers.utils.formatEther(await vault.userBalance(addr1.address))).to.equal("100.0");
    });
    it("teacherSetStudentScore", async function () {
        //取款
        await token.mint(addr1.address, ethers.utils.parseEther('100'));
        await token.connect(addr1).approve(vault.address, ethers.utils.parseEther('100'));
        await vault.connect(addr1).deposit(ethers.utils.parseEther('100'));
        await vault.connect(addr1).withdraw(ethers.utils.parseEther('10'));
        expect(ethers.utils.formatEther(await vault.userBalance(addr1.address))).to.equal("90.0");
    });
});