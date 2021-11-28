import { ethers } from "hardhat";
import { expect} from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";



describe("KhyberToken Contract", () => {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let khyberToken: Contract;
    let differentContract: Contract;

    before(async() => {
        const KhyberToken = await ethers.getContractFactory("KhyberToken");
        const DifferentContract = await ethers.getContractFactory("KhyberToken");

        [owner, alice, bob] = await ethers.getSigners();

        khyberToken = await KhyberToken.deploy()
        differentContract = await DifferentContract.deploy()
    })

    describe("Init", async() => {
        it("should deploy", async() => {
            expect(khyberToken)
                .to.be.ok
        })

        it("has a name", async() => {
            expect(await khyberToken.name())
                .to.eq("KhyberToken")
        })

        it("should have no supply after deployment", async() => {
            expect(await khyberToken.totalSupply())
                .to.eq(0)
        })
    })

    describe("Test minter role", async() => {
        it("should confirm deployer as owner", async() => {
            let minter = await khyberToken.MINTER_ROLE()
        await khyberToken.grantRole(minter, owner.address)
            expect(await khyberToken.hasRole(minter, owner.address))
                .to.eq(true)
        })

        it("should mint tokens from owner", async() => {
            // Sanity check
            expect(await khyberToken.balanceOf(owner.address))
                .to.eq(0)

            await khyberToken.mint(owner.address, 50)

            expect(await khyberToken.totalSupply())
                .to.eq(50)

            expect(await khyberToken.balanceOf(owner.address))
                .to.eq(50)
        })

        it("should revert mint from non-minter", async() => {
            await expect(khyberToken.connect(alice).mint(alice.address, 20))
                .to.be.reverted
        })

        it("should revert transfer from non-admin", async() => {
            let minter = await khyberToken.MINTER_ROLE()
          await expect(khyberToken.connect(alice).grantRole(minter, alice.address))
            .to.be.reverted
        })
    })
})