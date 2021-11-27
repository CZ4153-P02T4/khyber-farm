import { ethers } from "hardhat";
import { expect} from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";



describe("KhyberToken Contract", () => {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let khyrstalToken: Contract;
    let differentContract: Contract;

    before(async() => {
        const KhyberToken = await ethers.getContractFactory("KhyberToken");
        const DifferentContract = await ethers.getContractFactory("KhyberToken");

        [owner, alice, bob] = await ethers.getSigners();

        khyrstalToken = await KhyberToken.deploy()
        differentContract = await DifferentContract.deploy()
    })

    describe("Init", async() => {
        it("should deploy", async() => {
            expect(khyrstalToken)
                .to.be.ok
        })

        it("has a name", async() => {
            expect(await khyrstalToken.name())
                .to.eq("KhyberToken")
        })

        it("should have no supply after deployment", async() => {
            expect(await khyrstalToken.totalSupply())
                .to.eq(0)
        })
    })

    describe("Test minter role", async() => {
        it("should confirm deployer as owner", async() => {
            let minter = await khyrstalToken.MINTER_ROLE()
        await khyrstalToken.grantRole(minter, owner.address)
            expect(await khyrstalToken.hasRole(minter, owner.address))
                .to.eq(true)
        })

        it("should mint tokens from owner", async() => {
            // Sanity check
            expect(await khyrstalToken.balanceOf(owner.address))
                .to.eq(0)

            await khyrstalToken.mint(owner.address, 50)

            expect(await khyrstalToken.totalSupply())
                .to.eq(50)

            expect(await khyrstalToken.balanceOf(owner.address))
                .to.eq(50)
        })

        it("should revert mint from non-minter", async() => {
            await expect(khyrstalToken.connect(alice).mint(alice.address, 20))
                .to.be.reverted
        })

        it("should revert transfer from non-admin", async() => {
            let minter = await khyrstalToken.MINTER_ROLE()
          await expect(khyrstalToken.connect(alice).grantRole(minter, alice.address))
            .to.be.reverted
        })
    })
})