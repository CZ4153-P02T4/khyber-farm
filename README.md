# Khyber Farm

![image](https://user-images.githubusercontent.com/22881005/143726112-7a98f544-0b58-45ee-9084-79d0e6830c62.png)

This repository provides a DAI staking mechanism; whereby, the user receives KhyberToken as a reward for staking DAI in the contract. Furthermore, the user can purchase a KHRYSTAL NFT through the NFT factory named Khyber Crystal. The KhyberTokens are sent to a lottery pool inside the Lottery contract. Finally, each NFT includes a tokenId which acts as a lottery ticket. The lottery feature uses Chainlink's VRF to provide a verifiably random number. The winner receives the contents of the lottery pool. 


https://user-images.githubusercontent.com/22881005/195197261-72c94305-b3ae-46af-a8f9-d1eb3bfdc06b.mp4


## Prerequisites
```
NodeJS and NPM >= 7.5.0
```
***
## Installation
In directory root:
```
npm i
```
***
## Testing
```
npx hardhat test
```
***
## Deployment
### Prerequisites
This dApp accepts DAI as its staking token; therefore, you'll need to acquire Kovan DAI if you deploy to Kovan (as it's preconfigured). To attain kDAI, you'll need to lock kETH in a Maker vault in exchange for kDAI.
* Network Provider
    * Infura.io
    * Alchemy.com
* MetaMask 
    * MetaMask.io
* Kovan DAI 
    * https://oasis.app/borrow?network=kovan
* Kovan LINK
    * https://kovan.chain.link/

The Hardhat configuration file and scripts have been set up to deploy on the Kovan testnet. Use the .env_sample as a template for the requisite API_KEY and PRIVATE_KEY. Infura and Alchemy offer free API access to testnets and mainnet. Once you have an API endpoint and your private key from MetaMask, create a dotenv file within the KhyberFarm root:

```
touch .env
```
Populate the .env with your API_KEY and PRIVATE_KEY. 
<br>
_*If you're posting on GitHub, DO NOT FORGET to .gitignore the dotenv(.env) file!_
<br>
<br>
Uncomment out the Kovan network details in hardhat.config.ts:
```
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
    }
  }
```
In the KhyberFarm root, run:
```
npx hardhat run scripts/deployFarm.ts --network rinkeby
```

> ## Todo (for school-end wrap up)  
> * [ ] add connect wallet button  
> * [ ] modify contract so as to see nft on opensea  

