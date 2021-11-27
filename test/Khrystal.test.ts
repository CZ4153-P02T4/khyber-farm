import { ethers } from "hardhat";
import chai, { expect} from "chai";
import { Contract } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity)

describe("Khrystal Contract", () => {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let khrystal: Contract;

    before(async() => {
        const KhrystalCrystal = await ethers.getContractFactory("KhyberCrystal");

        [owner, alice, bob] = await ethers.getSigners();

        khrystal =  await KhrystalCrystal.deploy()
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
    })
})