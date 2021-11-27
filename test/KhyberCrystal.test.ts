import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { Contract } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity)

describe("KhyberCrystal Contract", () => {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let khrystal: Contract;

    beforeEach(async() => {
        const KhyberCrystal = await ethers.getContractFactory("KhyberCrystal");
        [owner, alice, bob] = await ethers.getSigners();
        khrystal =  await KhyberCrystal.deploy()
        let minter = await khrystal.MINTER_ROLE()
        await khrystal.grantRole(minter, owner.address)
    })

    describe("Init", async() => {
        it("should deploy", async() => {
            expect(khrystal)
                .to.be.ok
        })

        it("has a name", async() => {
            expect(await khrystal.name())
                .to.eq("Khyber Crystal")
        })

        it("tracks tokens", async() => {
            await khrystal.safeMint(owner.address)
            await khrystal.safeMint(owner.address)

            expect(await khrystal.getTotalSupply())
                .to.eq(2)
        })

        it("should enumerate", async() => {
            await khrystal.safeMint(owner.address)
            await khrystal.safeMint(owner.address)
            await khrystal.safeMint(owner.address)
            await khrystal.safeMint(owner.address)
            await khrystal.safeMint(owner.address)
            await khrystal.transferFrom(owner.address, alice.address, 4)
            let res = await khrystal.tokenOfOwnerByIndex(alice.address, 0)
            expect(res).to.eq(4)
            res = await khrystal.balanceOf(alice.address)
            expect(res).to.eq(1)
            res = await khrystal.balanceOf(owner.address)
            expect(res).to.eq(4)
        })
    })
})
