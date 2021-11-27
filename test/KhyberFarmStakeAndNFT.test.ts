import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle"
import { Contract, BigNumber } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@openzeppelin/test-helpers";

chai.use(solidity)

describe("KhyberFarm Contract", () => {
    
    let res: any;

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let carol: SignerWithAddress;
    let dave: SignerWithAddress;
    let eve: SignerWithAddress;

    let khyberFarm: Contract;
    let mockKNC: Contract;
    let khyberToken: Contract;
    let khrystal: Contract;

    const kncAmount: BigNumber = ethers.utils.parseEther("25000");
    const nftPrice: BigNumber = ethers.utils.parseEther("1")

    before(async() => {
        const KhyberFarm = await ethers.getContractFactory("KhyberFarm");
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const KhyberToken = await ethers.getContractFactory("KhyberToken");
        const KhyberCrystal = await ethers.getContractFactory("KhyberCrystal");

        [owner, alice, bob, carol, dave, eve] = await ethers.getSigners();

        mockKNC = await MockERC20.deploy("mockKNC", "mKNC")
        khyberToken =  await KhyberToken.deploy()
        khrystal = await KhyberCrystal.deploy()

        /*//////////////////////
        // Knc Transfers      //
        //////////////////////*/

        await Promise.all([
            mockKNC.mint(owner.address, kncAmount),
            mockKNC.mint(alice.address, kncAmount),
            mockKNC.mint(bob.address, kncAmount),
            mockKNC.mint(carol.address, kncAmount),
            mockKNC.mint(dave.address, kncAmount),
            mockKNC.mint(eve.address, kncAmount)
        ])

        let khyberFarmParams: Array<string | BigNumber> = [
            mockKNC.address,
            khyberToken.address,
            khrystal.address,
            nftPrice
        ]

        // KhyberFarm Contract deployment
        khyberFarm = await KhyberFarm.deploy(...khyberFarmParams)

    })

    describe("Init", async() => {
        it("should deploy contracts", async() => {
            expect(khyberFarm).to.be.ok
            expect(khyberToken).to.be.ok
            expect(mockKNC).to.be.ok
        })

        it("should return name", async() => {
            expect(await khyberFarm.name())
                .to.eq("Khyber Farm")
            expect(await mockKNC.name())
                .to.eq("mockKNC")
            expect(await khyberToken.name())
                .to.eq("KhyberToken")
        })

        it("should show mockKNC balance", async() => {
            expect(await mockKNC.balanceOf(owner.address))
                .to.eq(kncAmount)
        })

    })

    describe("Staking", async() => {
        it("should stake and update mapping", async() => {
            let toTransfer = ethers.utils.parseEther("100")
            await mockKNC.connect(alice).approve(khyberFarm.address, toTransfer)

            expect(await khyberFarm.isStaking(alice.address))
                .to.eq(false)
            
            expect(await khyberFarm.connect(alice).stake(toTransfer))
                .to.be.ok

            expect(await khyberFarm.stakingBalance(alice.address))
                .to.eq(toTransfer)
            
            expect(await khyberFarm.isStaking(alice.address))
                .to.eq(true)
        })

        it("should remove knc from user", async() => {
            res = await mockKNC.balanceOf(alice.address)
            expect(Number(res))
                .to.be.lessThan(Number(kncAmount))
        })

        it("should update balance with multiple stakes", async() => {
            let toTransfer = ethers.utils.parseEther("100")
            await mockKNC.connect(eve).approve(khyberFarm.address, toTransfer)
            await khyberFarm.connect(eve).stake(toTransfer)
            
        })

        it("should revert stake with zero as staked amount", async() => {
            await expect(khyberFarm.connect(bob).stake(0))
                .to.be.revertedWith("You cannot stake zero tokens")
        })

        it("should revert stake without allowance", async() => {
            let toTransfer = ethers.utils.parseEther("50")
            await expect(khyberFarm.connect(bob).stake(toTransfer))
                .to.be.revertedWith("transfer amount exceeds allowance")
        })

        it("should revert with not enough funds", async() => {
            let toTransfer = ethers.utils.parseEther("1000000")
            await mockKNC.approve(khyberFarm.address, toTransfer)

            await expect(khyberFarm.connect(bob).stake(toTransfer))
                .to.be.revertedWith("You cannot stake zero tokens")
        })
    })

    describe("Unstaking", async() => {
        it("should unstake balance from user", async() => {
            res = await khyberFarm.stakingBalance(alice.address)
            expect(Number(res))
                .to.be.greaterThan(0)

            let toTransfer = ethers.utils.parseEther("100")
            await khyberFarm.connect(alice).unstake(toTransfer)

            res = await khyberFarm.stakingBalance(alice.address)
            expect(Number(res))
                .to.eq(0)
        })

        it("should remove staking status", async() => {
            expect(await khyberFarm.isStaking(alice.address))
                .to.eq(false)
        })

        it("should transfer ownership", async() => {
            let minter = await khyberToken.MINTER_ROLE()

            //await khyberToken._transferOwnership(khyberFarm.address)
            //let minter = khyberToken.MINTER_ROLE()
            await khyberToken.grantRole(minter, khyberFarm.address)

            expect(await khyberToken.hasRole(minter, khyberFarm.address))
                .to.eq(true)
        })
    })
})

describe("Start from deployment for time increase", () => {
    let res: any
    let expected: any
    
    let alice: SignerWithAddress
    let mockKNC: Contract
    let khyberFarm: Contract
    let khyberToken: Contract
    let khrystal: Contract

    beforeEach(async() => {
        // Bare-boned initial deployment setup
        const KhyberFarm = await ethers.getContractFactory("KhyberFarm");
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const KhyberToken = await ethers.getContractFactory("KhyberToken");
        const KhyberCrystal = await ethers.getContractFactory("KhyberCrystal");
        [alice] = await ethers.getSigners();
        mockKNC = await MockERC20.deploy("MockKNC", "mKNC")
        khyberToken =  await KhyberToken.deploy()
        khrystal = await KhyberCrystal.deploy()
        const kncAmount: BigNumber = ethers.utils.parseEther("25000");
        const nftPrice: BigNumber = ethers.utils.parseEther("1")
        await mockKNC.mint(alice.address, kncAmount),
        khyberFarm = await KhyberFarm.deploy(
            mockKNC.address, 
            khyberToken.address, 
            khrystal.address, 
            nftPrice
            )
        //await khyberToken._transferOwnership(khyberFarm.address)
        let minter = await khyberToken.MINTER_ROLE()
        await khyberToken.grantRole(minter, khyberFarm.address)

        let khrystalMinter = await khrystal.MINTER_ROLE()
        await khrystal.grantRole(khrystalMinter, khyberFarm.address)
    })

    describe("Yield", async() => {
        it("should return correct yield time", async() => {
            // Setup
            let toTransfer = ethers.utils.parseEther("10")
            await mockKNC.approve(khyberFarm.address, toTransfer)
            await khyberFarm.stake(toTransfer)

            // Start time
            let timeStart = await khyberFarm.startTime(alice.address)
            expect(Number(timeStart))
                .to.be.greaterThan(0)

            // Fast-forward time
            await time.increase(86400)

            expect(await khyberFarm.calculateYieldTime(alice.address))
                .to.eq((86400))
        })

        it("should mint correct token amount in total supply and user", async() => { 
            // Setup
            let toTransfer = ethers.utils.parseEther("10")
            await mockKNC.approve(khyberFarm.address, toTransfer)
            await khyberFarm.stake(toTransfer)

            await time.increase(86400)

            let _time = await khyberFarm.calculateYieldTime(alice.address)
            let formatTime = _time / 86400
            let staked = await khyberFarm.stakingBalance(alice.address)
            let bal = staked * formatTime
            let newBal = ethers.utils.formatEther(bal.toString())
            expected = Number.parseFloat(newBal).toFixed(3)

            await khyberFarm.withdrawYield()

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
            let toTransfer = ethers.utils.parseEther("10")
            await mockKNC.approve(khyberFarm.address, toTransfer)
            await khyberFarm.stake(toTransfer)

            let staked = await khyberFarm.stakingBalance(alice.address)

            await time.increase(86400)
            await khyberFarm.unstake(ethers.utils.parseEther("5"))

            res = await khyberFarm.khyberBalance(alice.address)
            expect(Number(ethers.utils.formatEther(res)))
                .to.be.approximately(10, .001)
        })
    })

    describe("Multiple Stakes", async() => {
        it("should update yield balance after multiple stakes", async() => {
            let toTransfer = ethers.utils.parseEther("10")
            await mockKNC.approve(khyberFarm.address, toTransfer)
            await khyberFarm.stake(toTransfer)

            time.increase(8640)

            toTransfer = ethers.utils.parseEther("10")
            await mockKNC.approve(khyberFarm.address, toTransfer)
            await khyberFarm.stake(toTransfer)

            res = await khyberFarm.khyberBalance(alice.address)
            let formatRes = ethers.utils.formatEther(res)

            expect(Number.parseFloat(formatRes).toFixed(3))
                .to.eq("1.000")
        })
    })

    describe("NFT", async() => {
        it("should mint an nft", async() => {
            let toTransfer = ethers.utils.parseEther("100")
            await mockKNC.approve(khyberFarm.address, toTransfer)
            await khyberFarm.stake(toTransfer)

            time.increase(1000000)

            await khyberFarm.withdrawYield()

            toTransfer = ethers.utils.parseEther("1")
            await khyberToken.approve(khyberFarm.address, toTransfer)
            await khyberFarm.mintNFT(alice.address, "www")

            await khyberToken.approve(khyberFarm.address, toTransfer)
            expect(await khyberFarm.mintNFT(alice.address, "www"))
                .to.emit(khyberFarm, "MintNFT")
                .withArgs(alice.address, 1)

            await khyberToken.approve(khyberFarm.address, toTransfer)
            expect(await khyberFarm.mintNFT(alice.address, "www"))
                .to.emit(khyberFarm, "MintNFT")
                .withArgs(alice.address, 2)
        })
    })

    describe("Events", async() => {
        it("should emit Stake", async() => {
            let toTransfer = ethers.utils.parseEther("10")
            await mockKNC.approve(khyberFarm.address, toTransfer)

            await expect(khyberFarm.stake(toTransfer))
                .to.emit(khyberFarm, 'Stake')
                .withArgs(alice.address, toTransfer);
        })

        it("should emit Unstake", async() => {
            let toTransfer = ethers.utils.parseEther("10")
            await mockKNC.approve(khyberFarm.address, toTransfer)
            await khyberFarm.stake(toTransfer)

            expect(await khyberFarm.unstake(toTransfer))
                .to.emit(khyberFarm, "Unstake")
                .withArgs(alice.address, toTransfer)
        })

        it("should emit YieldWithdraw", async() => {
            let toTransfer = ethers.utils.parseEther("10")
            await mockKNC.approve(khyberFarm.address, toTransfer)
            await khyberFarm.stake(toTransfer)
            await time.increase(86400)
            await khyberFarm.unstake(toTransfer)

            res = await khyberFarm.khyberBalance(alice.address)

            expect(await khyberFarm.withdrawYield())
                .to.emit(khyberFarm, "YieldWithdraw")
                .withArgs(alice.address, res)
        })

        it("should emit MintNFT event", async() => {
            let toTransfer = ethers.utils.parseEther("10")
            await mockKNC.approve(khyberFarm.address, toTransfer)
            await khyberFarm.stake(toTransfer)
            await time.increase(86400)

            await khyberFarm.withdrawYield()

            toTransfer = ethers.utils.parseEther("1")
            await khyberToken.approve(khyberFarm.address, toTransfer)
            expect(await khyberFarm.mintNFT(alice.address, "www"))
                .to.emit(khyberFarm, "MintNFT")
                .withArgs(alice.address, 0)
        })
    })
})