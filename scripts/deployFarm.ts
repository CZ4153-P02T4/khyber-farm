import { ethers } from "hardhat";
import { mainConfig } from "./config";

const nftPrice = ethers.utils.parseEther("1")

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log(`Deploying contracts with ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`)

    /**
     * @notice For tetsnets without Maker/DAI
     * @dev Comment out if using a network with DAI (ie Kovan) and use/insert
     *      DAI address in config.ts
     */
    // const MockDai = await ethers.getContractFactory("MockDai")
    // const mockDai = await MockDai.deploy()

    const KhyberToken = await ethers.getContractFactory("KhyberToken")
    const khyberToken = await KhyberToken.deploy()
    console.log(`KhyberToken address: ${khyberToken.address}`)

    const KhyberCrystal = await ethers.getContractFactory("KhyberCrystal")
    const khrystal = await KhyberCrystal.deploy()
    console.log(`KhyberCrystal address: ${khrystal.address}`)

    const KhyberFarm = await ethers.getContractFactory("KhyberFarm");
    const khyberFarm = await KhyberFarm.deploy(
        ...mainConfig, khyberToken.address, khrystal.address, nftPrice
        // mockKNC.address, khyberToken.address, khrystal.address, nftPrice
        )
    console.log(`KhyberFarm address: ${khyberFarm.address}`)
    console.log(`NFT Price: ${ethers.utils.formatEther(nftPrice)} KHYBER`)

    const khyberMinter = await khyberToken.MINTER_ROLE()
    await khyberToken.grantRole(khyberMinter, khyberFarm.address)
    console.log(`KhyberToken minter role transferred to: ${khyberFarm.address}`)

    const khrystalMinter = await khrystal.MINTER_ROLE()
    await khrystal.grantRole(khrystalMinter, khyberFarm.address)
    console.log(`Khyber Crystal NFT minter role transferred to ${khyberFarm.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })