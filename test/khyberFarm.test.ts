import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle"
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@openzeppelin/test-helpers";

chai.use(solidity)

describe("KhyberFarm", () => {
    
    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let res: any;
    let khyberFarm: Contract;
    let khyberToken: Contract;
    let mockKnc: Contract;

    const kncAmount: BigNumber = ethers.utils.parseEther("25000");


    beforeEach(async() => {
        const KhyberFarm = await ethers.getContractFactory("KhyberFarm");
        const KhyberToken = await ethers.getContractFactory("KhyberToken");
        const MockKnc = await ethers.getContractFactory("MockERC20");
        mockKnc = await MockKnc.deploy("MockKnc", "mKNC");
        [owner, alice, bob] = await ethers.getSigners();
        await Promise.all([
            mockKnc.mint(owner.address, kncAmount),
            mockKnc.mint(alice.address, kncAmount),
            mockKnc.mint(bob.address, kncAmount)
        ]);
        khyberToken = await KhyberToken.deploy();
        khyberFarm = await KhyberFarm.deploy(mockKnc.address, khyberToken.address);
    })

    describe("Init", async() => {
        it("should initialize", async() => {
            expect(await khyberToken).to.be.ok
            expect(await khyberFarm).to.be.ok
            expect(await mockKnc).to.be.ok
        })
    })

    describe("Stake", async() => {
        it("should accept KNC and update mapping", async() => {
            let toTransfer = ethers.utils.parseEther("100")
            await mockKnc.connect(alice).approve(khyberFarm.address, toTransfer)

            expect(await khyberFarm.isStaking(alice.address))
                .to.eq(false)
            
            expect(await khyberFarm.connect(alice).stake(toTransfer))
                .to.be.ok

            expect(await khyberFarm.stakingBalance(alice.address))
                .to.eq(toTransfer)
            
            expect(await khyberFarm.isStaking(alice.address))
                .to.eq(true)
        })

        it("should update balance with multiple stakes", async() => {
            let toTransfer = ethers.utils.parseEther("100")
            await mockKnc.connect(alice).approve(khyberFarm.address, toTransfer)
            await khyberFarm.connect(alice).stake(toTransfer)

            await mockKnc.connect(alice).approve(khyberFarm.address, toTransfer)
            await khyberFarm.connect(alice).stake(toTransfer)

            expect(await khyberFarm.stakingBalance(alice.address))
                .to.eq(ethers.utils.parseEther("200"))
        })  

        it("should revert with not enough funds", async() => {
            let toTransfer = ethers.utils.parseEther("1000000")
            await mockKnc.approve(khyberFarm.address, toTransfer)

            await expect(khyberFarm.connect(bob).stake(toTransfer))
                .to.be.revertedWith("You cannot stake zero tokens")
        })
    })

    describe("Unstake", async() => {
        beforeEach(async() => {
            let toTransfer = ethers.utils.parseEther("100")
            await mockKnc.connect(alice).approve(khyberFarm.address, toTransfer)
            await khyberFarm.connect(alice).stake(toTransfer)
        })

        it("should unstake balance from user", async() => {
            let toTransfer = ethers.utils.parseEther("100")
            await khyberFarm.connect(alice).unstake(toTransfer)

            res = await khyberFarm.stakingBalance(alice.address)
            expect(Number(res))
                .to.eq(0)

            expect(await khyberFarm.isStaking(alice.address))
                .to.eq(false)
        })
    })

    describe("WithdrawYield", async() => {

        beforeEach(async() => {
            //await khyberToken._transferOwnership(khyberFarm.address)
            let minter = await khyberToken.MINTER_ROLE()
            await khyberToken.grantRole(minter, khyberFarm.address)
            let toTransfer = ethers.utils.parseEther("10")
            await mockKnc.connect(alice).approve(khyberFarm.address, toTransfer)
            await khyberFarm.connect(alice).stake(toTransfer)
        })

        it("should return correct yield time", async() => {
            let timeStart = await khyberFarm.startTime(alice.address)
            expect(Number(timeStart))
                .to.be.greaterThan(0)

            // Fast-forward time
            await time.increase(86400)

            expect(await khyberFarm.calculateYieldTime(alice.address))
                .to.eq((86400))
        })

        it("should mint correct token amount in total supply and user", async() => { 
            await time.increase(86400)

            let _time = await khyberFarm.calculateYieldTime(alice.address)
            let formatTime = _time / 86400
            let staked = await khyberFarm.stakingBalance(alice.address)
            let bal = staked * formatTime
            let newBal = ethers.utils.formatEther(bal.toString())
            let expected = Number.parseFloat(newBal).toFixed(3)

            await khyberFarm.connect(alice).withdrawYield()

            res = await khyberToken.totalSupply()
            let newRes = ethers.utils.formatEther(res)
            let formatRes = Number.parseFloat(newRes).toFixed(3).toString()

            expect(expected)
                .to.eq(formatRes)

            res = await khyberToken.balanceOf(alice.address)
            newRes = ethers.utils.formatEther(res)
            formatRes = Number.parseFloat(newRes).toFixed(3).toString()

            expect(expected)
                .to.eq(formatRes)
        })

        it("should update yield balance when unstaked", async() => {
            await time.increase(86400)
            await khyberFarm.connect(alice).unstake(ethers.utils.parseEther("5"))

            res = await khyberFarm.khyberBalance(alice.address)
            expect(Number(ethers.utils.formatEther(res)))
                .to.be.approximately(10, .001)
        })

        it("should return correct yield after partial unstake", async() => {
            await time.increase(86400)
            await khyberFarm.connect(alice).unstake(ethers.utils.parseEther("5"))
            await time.increase(86400)
            await khyberFarm.connect(alice).withdrawYield()
            res = await khyberToken.balanceOf(alice.address)
            expect(Number(ethers.utils.formatEther(res)))
                .to.be.approximately(15, .001)
        })

    })
})