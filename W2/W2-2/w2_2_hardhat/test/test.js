const { expect } = require("chai");

let score;
let teacher;
let owner;
let addr1;
let addr2;
beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    //学生合约
    const Score = await ethers.getContractFactory("Score");
    score = await Score.deploy();
    //老师合约
    const Teacher = await ethers.getContractFactory("Teacher");
    teacher = await Teacher.deploy(score.address);
});

describe("Teacher", function () {
    it("addTeacher", async function () {
        //新老师权限
        await score.addTeacher(addr1.address);
        expect(await score.teacherAddr(addr1.address)).ok;
    });
    it("teacherSetStudentScore", async function () {
        await score.addTeacher(addr1.address);
        expect(await score.teacherAddr(addr1.address)).ok;
        //设置学生分数
        await teacher.connect(addr1).teacherSetStudentScore(addr2.address, 90);
        // 查询学生
        let student = await score.student(addr2.address);
        expect(student.toString()).to.equal("90");
    });
});