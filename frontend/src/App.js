import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { ethers } from "ethers"

import KhyberFarm from "./abis/KhyberFarm.json"
import KhyberToken from "./abis/KhyberToken.json"
import KhyberCrystal from "./abis/KhyberCrystal.json"
import Lottery from "./abis/Lottery.json"
import ERC20 from "./abis/ERC20.json"

import { UserProvider } from "./context/UserContext"
import { ContractProvider } from "./context/ContractContext"

import Main from "./components/Main";

const Container = styled.div`
    width: 100%;
    height: 75rem;
`;

function App() {

  /**
   * @notice User state
   */
    const [userAddress, setUserAddress] = useState("")
    const [ethBalance, setEthBalance] = useState("")
    const [daiBalance, setDaiBalance] = useState("")
    const [khyberBalance, setKhyberBalance] = useState("")
    const [stakingBalance, setStakingBalance] = useState("")
    const [khyberYield, setKhyberYield] = useState("")
    const [khyberUnrealizedYield, setKhyberUnrealizedYield] = useState("")
    const [userNFTs, setUserNFTs] = useState("")

    const userState = {
        userAddress, 
        setUserAddress,
        ethBalance, 
        setEthBalance,
        daiBalance,
        setDaiBalance,
        khyberBalance,
        setKhyberBalance,
        stakingBalance,
        setStakingBalance,
        khyberYield,
        setKhyberYield,
        khyberUnrealizedYield,
        setKhyberUnrealizedYield,
        userNFTs,
        setUserNFTs,
    }

    /**
     * @notice Contract state
     */
    const [init, setInit] = useState(false)
    const [networkId, setNetworkId] = useState("")
    const [provider, setProvider] = useState({})
    const [daiContract, setDaiContract] = useState({})
    const [linkContract, setLinkContract] = useState({})
    const [khyberTokenContract, setKhyberTokenContract] = useState({})
    const [khyberFarmContract, setKhyberFarmContract] = useState({})
    const [khrystalContract, setKhrystalContract] = useState({})
    const [lotteryContract, setLotteryContract] = useState({})
    const [isLotteryOpen, setIsLotteryOpen] = useState(false)
    const [isNFTOpen, setIsNFTOpen] = useState(false)
    const [isOwnerOpen, setIsOwnerOpen] = useState(false)
    const [lotteryBalance, setLotteryBalance] = useState("")
    const [linkBalance, setLinkBalance] = useState("")
    const [lotteryCount, setLotteryCount] = useState("")
    const [owner, setOwner] = useState("")
    const [winningNumber, setWinningNumber] = useState("")

    const contractState = {
        init,
        setInit,
        networkId,
        setNetworkId,
        provider,
        setProvider,
        daiContract,
        setDaiContract,
        linkContract,
        setLinkContract,
        khyberTokenContract,
        setKhyberTokenContract,
        khyberFarmContract,
        setKhyberFarmContract,
        khrystalContract,
        setKhrystalContract,
        lotteryContract,
        setLotteryContract,
        isLotteryOpen, 
        setIsLotteryOpen,
        isNFTOpen,
        setIsNFTOpen,
        isOwnerOpen,
        setIsOwnerOpen,
        lotteryBalance,
        setLotteryBalance,
        linkBalance,
        setLinkBalance,
        lotteryCount,
        setLotteryCount,
        owner,
        setOwner,
        winningNumber,
        setWinningNumber,
    }

    /**
     * @notice componentDidMount
     */

    const loadProvider = useCallback(async() => {
        let prov = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(prov)
        return prov
    }, [setProvider])

    const loadDaiContract = useCallback(async(_provider) => {
        let daiAddress = "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8" 
        let contract = new ethers.Contract(daiAddress, ERC20.abi, _provider)
        setDaiContract(contract)
    }, [setDaiContract])
    
    const loadLinkContract = useCallback(async(_provider) => {
        let linkAddress = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
        let contract = new ethers.Contract(linkAddress, ERC20.abi, _provider)
        setLinkContract(contract)
    }, [setLinkContract])

    const loadKhyberToken = useCallback(async(_provider) => {
        // let KhyberTokenAddress = KhyberToken["networks"]["42"]["address"] // kovan network id
        let KhyberTokenAddress = KhyberToken["networks"]["4"]["address"] // rinkeby network id
        let contract = new ethers.Contract(KhyberTokenAddress, KhyberToken.abi, _provider)
        setKhyberTokenContract(contract)
    }, [setKhyberTokenContract])

    const loadKhyberFarmContract = useCallback(async(_provider) => {
        // let khyberFarmAddress = KhyberFarm["networks"]["42"]["address"] // kovan network id
        let khyberFarmAddress = KhyberFarm["networks"]["4"]["address"] // rinkeby network id
        let contract = new ethers.Contract(khyberFarmAddress, KhyberFarm.abi, _provider)
        setKhyberFarmContract(contract)
    }, [setKhyberFarmContract])

    const loadKhrystalContract = useCallback(async(_provider) => {
        // let khrystalContractAddress = KhyberCrystal["networks"]["42"]["address"] // kovan network id
        let khrystalContractAddress = KhyberCrystal["networks"]["4"]["address"] // rinkeby network id
        let contract = new ethers.Contract(khrystalContractAddress, KhyberCrystal.abi, _provider)
        setKhrystalContract(contract)
    }, [setKhrystalContract])

    const loadLotteryContract = useCallback(async(_provider) => {
        // let lotteryContractAddress = Lottery["networks"]["42"]["address"] // kovan network id
        let lotteryContractAddress = Lottery["networks"]["4"]["address"] // rinkeby network id
        console.log("Lottery: ", lotteryContractAddress)
        let contract = new ethers.Contract(lotteryContractAddress, Lottery.abi, _provider)
        setLotteryContract(contract)
    }, [setLotteryContract])

    const componentDidMount = useCallback(async() => {
    	await loadProvider().then(async(res) => {
            await loadDaiContract(res)
            await loadLinkContract(res)
            await loadKhyberToken(res)
            await loadKhyberFarmContract(res)
            await loadKhrystalContract(res)
            await loadLotteryContract(res)
        })
        setInit(true)
    }, [
        loadProvider, 
        loadDaiContract, 
        loadLinkContract,
        loadKhyberToken, 
        loadKhyberFarmContract, 
        loadKhrystalContract,
        loadLotteryContract,
        setInit
    ])

    useEffect(() => {
    	try {
    		if(init === false){
    			componentDidMount()
    		  }
    	} catch (error) {
    		console.log(error)
    	}
    }, [componentDidMount, daiContract, init])

    /**
     * @notice userDidMount functions
     */

    const loadUser = useCallback(async() => {
        let accounts = provider.getSigner()
        let account = await accounts.getAddress()
        return account
    }, [provider])

    const loadNetwork = useCallback(async() => {
        let netId = await provider.getNetwork()
        setNetworkId(netId["name"])
    }, [provider, setNetworkId])

    const loadEthBalance = useCallback(async(user) => {
        let balance = await provider.getBalance(user)
        setEthBalance(balance)
    }, [provider, setEthBalance])

    const loadDaiBalance = useCallback(async(user) => {
        console.log(user);
        let balance = await daiContract.balanceOf(user)
        setDaiBalance(balance.toString())
    }, [daiContract, setDaiBalance])

    const loadKhyberBalance = useCallback(async(user) => {
        let balance = await khyberTokenContract.balanceOf(user)
        setKhyberBalance(balance.toString())
    }, [khyberTokenContract, setKhyberBalance])

    const loadStakingBalance = useCallback(async(user) => {
        let balance = await khyberFarmContract.stakingBalance(user)
        setStakingBalance(balance.toString())
    }, [setStakingBalance, khyberFarmContract])

    const loadKhyberYield = useCallback(async(user) => {
        let balance = await khyberFarmContract.calculateYieldTotal(user)
        setKhyberYield(balance.toString())
    }, [setKhyberYield, khyberFarmContract])

    const loadKhyberUnrealizedYield = useCallback(async(user) => {
        let balance = await khyberFarmContract.khyberBalance(user)
        setKhyberUnrealizedYield(balance.toString())
    }, [setKhyberUnrealizedYield, khyberFarmContract])


    const userDidMount = useCallback(async() => {
    	try{
    		await loadUser().then(res => {
    			setUserAddress(res)
    			loadEthBalance(res)
    			loadDaiBalance(res)
    			loadKhyberBalance(res)
    			loadStakingBalance(res)
    			loadKhyberYield(res)
    			loadKhyberUnrealizedYield(res)
    		})
    	} catch(error) {
    		console.log(error)
    	}
        await loadNetwork()
    }, [
        loadUser, 
        loadNetwork, 
        loadEthBalance, 
        loadDaiBalance,
        loadKhyberBalance,
        loadStakingBalance,
        setUserAddress,
        loadKhyberYield,
        loadKhyberUnrealizedYield
    ])

    useEffect(() => {
        if(userAddress === "" && init === true){
            userDidMount()
        }
    }, [userDidMount, init, userAddress])

    /**
     * @notice Contract balances/state
     */

    const loadOwner = useCallback(async() => {
        let contractOwner = await lotteryContract.owner()
        setOwner(contractOwner)
    }, [lotteryContract, setOwner])

    const loadLotteryPool = useCallback(async() => {
        let balance = await khyberTokenContract.balanceOf(lotteryContract.address)
        setLotteryBalance(ethers.utils.formatEther(balance))
    }, [lotteryContract, khyberTokenContract]) 

    const loadLinkBalance = useCallback(async() => {
        let balance = await linkContract.balanceOf(lotteryContract.address)
        setLinkBalance(ethers.utils.formatEther(balance))
    }, [lotteryContract, linkContract, setLinkBalance])

    const loadLotteryCount = useCallback(async() => {
        let count = await lotteryContract.lotteryCount()
        setLotteryCount(count.toString())
        return count.toString()
    }, [lotteryContract])

    const loadWinningNumber = useCallback(async(lottoCount) => {
        let number = await lotteryContract.winningNumber(lottoCount)
        setWinningNumber(number.toString())
    }, [setWinningNumber, lotteryContract])

    const contractStateDidMount = useCallback(async() => {
        await loadOwner()
        await loadLotteryPool()
        await loadLinkBalance()
        await loadLotteryCount()
            .then(async(res) => {
                await loadWinningNumber(res)
            })
        }, [
        loadOwner, 
        loadLotteryPool, 
        loadLinkBalance, 
        loadLotteryCount, 
        loadWinningNumber, 
    ])

    useEffect(() => {
      if(init === true){
        contractStateDidMount()
      }
    }, [init, contractStateDidMount])

    /**
    * @notice Events ----------------------------------------->
    */

    useEffect(() => {
        if(userAddress !== ""){
        /**
         * @notice KhyberFarm Events
         */
            khyberFarmContract.on("Stake", async(userAddress) => {
                await loadDaiBalance(userAddress)
                await loadStakingBalance(userAddress)
            });

            khyberFarmContract.on("Unstake", async(userAddress) => {
                await loadDaiBalance(userAddress)
                await loadStakingBalance(userAddress)
            })

            khyberFarmContract.on("YieldWithdraw", async(userAddress) => {
                await loadKhyberUnrealizedYield(userAddress)
                await loadKhyberYield(userAddress)
                await loadKhyberBalance(userAddress)
            })

            khyberFarmContract.on("MintNFT", async(userAddress) => {
                await loadKhyberBalance(userAddress)
            })

            /**
             * @notice Lottery events
             */

            lotteryContract.on("NumberReceived", async(userAddress) => {
                await loadLotteryCount()
                  .then(async(res) => {
                await loadWinningNumber(res)
                })
            })

            lotteryContract.on("LotteryClaim", async(userAddress) => {
                await loadKhyberBalance(userAddress)
                await loadLotteryPool()
            })

            lotteryContract.on("WithdrawLink", async(userAddress) => {
                await loadLinkBalance()
            })
        }

    /**
     * @notice Updates Khyber yield balance every 20 seconds
     */

    if(stakingBalance > 0){
        let interval = null
        interval = setInterval(() => {
            loadKhyberYield(userAddress)
        }, 20000)
    return () => clearInterval(interval)
    }

    }, [
        khyberFarmContract, 
        userAddress, 
        stakingBalance,
        lotteryContract,
        loadDaiBalance, 
        loadStakingBalance,
        loadKhyberUnrealizedYield,
        loadKhyberYield,
        loadKhyberBalance,
        loadWinningNumber,
        loadLotteryContract,
        loadLinkBalance,
        loadLotteryCount,
        loadLotteryPool,
    ])

    return (
        <Container>
          <ContractProvider value={contractState}>
            <UserProvider value={userState}>
              	<Main />
            </UserProvider>
          </ContractProvider>
        </Container>
      );
    }

export default App;
