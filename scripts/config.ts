import { ethers } from "ethers";
import { BigNumber } from "ethers";

type DeployParams = Array<string>
type LotteryParams = Array<string | BigNumber>

export const mainConfig: DeployParams = [
    // "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", // Dai kovan address
    // "0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658", // Dai rinkeby address
    "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8", // TestnetDai  rinkeby address
]

//https://docs.chain.link/docs/vrf-contracts/
export const lottoConfig: LotteryParams = [
    // "0xa36085F69e2889c224210F603D836748e7dC0088", // Link kovan address
    // "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9", // kovan Coordinator
    // "0xa36085F69e2889c224210F603D836748e7dC0088", // LINK kovan address
    // ethers.utils.parseEther(".1"), // VRF price
    // "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4" // kovan KeyHash
    "0x01BE23585060835E02B77ef475b0Cc51aA1e0709", // Link rinkeby address
    "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B", // Coordinator
    "0x01BE23585060835E02B77ef475b0Cc51aA1e0709", // LINK rinkeby address
    ethers.utils.parseEther(".1"), // VRF price
    "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311" // rinkeby KeyHash
]
