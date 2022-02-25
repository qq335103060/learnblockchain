const { expect } = require("chai");

let okTestToken;
let owner;
let addr1;
let addr2;
beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const OkTestToken = await ethers.getContractFactory("OkTestToken");
    okTestToken = await OkTestToken.deploy(ethers.utils.parseEther('10000'), ethers.utils.parseEther('10000'));
    
});

//创建合约判断铸币是否正确
describe("Token Name", function () {
    it("has a name", async function () {
        expect(await okTestToken.name()).to.equal("OKT Test Token");
    });
});