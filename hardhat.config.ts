import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";

require('dotenv').config()


export default {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  networks: {
    kovan: {
        gas: "auto",
        gasPrice: "auto",
        url: process.env.API_KEY_KOVAN,
        accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    rinkeby: {
      gas: "auto",
      gasPrice: "auto",
      url: process.env.API_KEY_RINKEBY,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    matic: {
      gas: "auto",
      gasPrice: "auto",
      url: process.env.API_KEY_MUMBAI,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
  }
}