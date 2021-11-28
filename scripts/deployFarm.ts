import { ethers } from "hardhat";
const fs = require('fs');
const path = require('path');
import { mainConfig, lottoConfig } from "./config";

const nftPrice = ethers.utils.parseEther("1")

let gasPrice;

async function main() {

    let outputData = {};
    
    const [deployer] = await ethers.getSigners()
    console.log(`Deploying contracts with ${deployer.address}`);
    
    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`)

    // gasPrice = 40000000;

    const KhyberToken = await ethers.getContractFactory("KhyberToken")
    const khyberToken = await KhyberToken.deploy()
    outputData["KhyberToken address"] = khyberToken.address
    console.log(`KhyberToken address: ${khyberToken.address}`)

    const KhyberCrystal = await ethers.getContractFactory("KhyberCrystal")
    const khrystal = await KhyberCrystal.deploy()
    outputData["KhyberCrystal address"] = khrystal.address
    console.log(`KhyberCrystal address: ${khrystal.address}`)
    
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(khrystal.address, khyberToken.address, ...lottoConfig);
    outputData["Lottery contract address"] = lottery.address
    console.log(`Lottery contract address: ${lottery.address}`);

    const KhyberFarm = await ethers.getContractFactory("KhyberFarm");
    const khyberFarm = await KhyberFarm.deploy(
        ...mainConfig, khyberToken.address, khrystal.address, lottery.address, nftPrice
        //...mainConfig, khyberToken.address, khrystal.address, nftPrice
        // mockDai.address, khyberToken.address, khrystal.address, nftPrice
        )
    outputData["KhyberFarm address"] = khyberFarm.address
    console.log(`KhyberFarm address: ${khyberFarm.address}`)
    console.log(`NFT Price: ${ethers.utils.formatEther(nftPrice)} KHYBER`)

    const khyberMinter = await khyberToken.MINTER_ROLE()
    await khyberToken.grantRole(khyberMinter, khyberFarm.address)
    console.log(`KhyberToken minter role transferred to: ${khyberFarm.address}`)

    const khrystalMinter = await khrystal.MINTER_ROLE()
    await khrystal.grantRole(khrystalMinter, khyberFarm.address)
    console.log(`Khyber Crystal NFT minter role transferred to ${khyberFarm.address}`)

    exportAddresses(outputData);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })

function exportAddresses(dictOutput) {
    let json = JSON.stringify(dictOutput, null, 2);
    fs.writeFileSync(path.join(__dirname, "addresses"), json);
  }