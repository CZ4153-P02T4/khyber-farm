import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { ethers } from "ethers";

import { useUser } from "../context/UserContext"
import { useContract } from "../context/ContractContext"

const MetaContainer = styled.div`
    height: 6rem;
    width: 100%;
    background-color: rgb(30, 31, 38);
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Title = styled.div`
    font-size: 1.8rem;
    color: white;
    font-weight: bold;
    text-shadow: .03rem .03rem green;
    margin-left: 2rem;
`;

const SubContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Network = styled.div`
    font-size: 1.5rem;
    color: white;
    margin-right: 2rem;
`;

const AccountWrapper = styled.div`
    height: 2.1rem;
    width: 16rem;
    font-size: 1.2rem;
    background: rgb(44, 48, 58);
    color: white;
    padding-left: 1rem;
    margin-right: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: .8rem;
`;

const Account = styled(AccountWrapper)`
    width: 9rem;
    background-color: black;
    height: 2rem;
    display: flex;
    justify-content: center;
    margin-right: 0;
    color: white;
    background: black;
`;

const Button = styled.button`
    width: 7rem;
    height: 2.2rem;
    font-size: 1.5rem;
    margin-right: 2rem;
    border-radius: .8rem;
    cursor: pointer;
    outline: none;
    color: white;
    background: transparent;
    border: none;

    ::after {
        content: '';
        display: block;
        position: relative;
        top: 0.5rem;
        left: 25%;
        width: 0%;
        height: .5rem;
        border-radius: 1rem;
        transition: 120ms;
      }

    :hover {
        ::after {
            width: 50%;
        }
    }
`;

const LotteryButton = styled(Button)`
    ::after {
        background: linear-gradient(45deg, #5f3c74, green);
    }
`;

const NFTButton = styled(Button)`
    ::after {
        background: linear-gradient(45deg, #5f3c74, #ED7014);
    }
`;

const OwnerButton = styled(Button)`
    ::after {
        background: linear-gradient(45deg, #5f3c74, white);
    }
`;

const Eth = styled.div`
    margin-left: .5rem;
`;

 
export default function NavBar() {

    const [isOwner, setIsOwner] = useState(false)

    const {
        userAddress,
        ethBalance,
        setUserNFTs
    } = useUser();

    const {
        networkId,
        isLotteryOpen,
        isNFTOpen,
        isOwnerOpen,
        lotteryContract,
        lotteryCount,
        khrystalContract,
        owner,
        setIsLotteryOpen,
        setIsNFTOpen,
        setIsOwnerOpen,
        setWinningNumber
    } = useContract();

    /**
     * @notice Fetch functions for the lottery
     */
    
    const loadWinningNumber = useCallback(async() => {
        let number = await lotteryContract.winningNumber(lotteryCount - 1)
        setWinningNumber(number.toString())
    }, [lotteryCount, lotteryContract, setWinningNumber])

    const loadUserNumbers = useCallback(async() => {
        try {
            let nftString = ""
            let total = await khrystalContract.balanceOf(userAddress)
            let i = 0
            while(i < total){
                let nfts = await khrystalContract.tokenOfOwnerByIndex(userAddress, i)
                if (nftString === ""){
                    nftString = nfts.toString()
                } else {
                    nftString += `, ${nfts.toString()}`
                }
                i++
            }
            setUserNFTs(nftString)
        } catch (error) {
            console.log(error)
        }
    }, [khrystalContract, userAddress, setUserNFTs])

    /**
     * @notice Functions handling modals for lottery, nft, and owner
     */

    async function handleLottery() {
        try{
            await loadWinningNumber()
        } catch (error) {
            console.log("Lottery not initiated", error)
        }
        await loadUserNumbers()
        setIsLotteryOpen(!isLotteryOpen)
    }

    function handleNFT() {
        setIsNFTOpen(!isNFTOpen)
    }

    function handleOwner() {
        setIsOwnerOpen(!isOwnerOpen)
    }

    const ownerComponent = <OwnerButton onClick={handleOwner} >Owner</OwnerButton>

    useEffect(() => {
        if(userAddress === owner){
            setIsOwner(true)
        } else {
            setIsOwner(false)
        }
    }, [userAddress, owner, setIsOwner])

    return(
            <MetaContainer>
                <Container>
                    <Title>Khyber Farm</Title>
                    <SubContainer>
                        {isOwner ? ownerComponent : null}
                        <NFTButton onClick={handleNFT}>
                            NFT
                        </NFTButton>
                        <LotteryButton onClick={handleLottery}>
                            Lottery
                        </LotteryButton>
                    </SubContainer>
                    <SubContainer>
                        <Network>
                            { networkId ? networkId.charAt(0).toUpperCase() + networkId.slice(1) : "N/A" }
                        </Network>
                        <AccountWrapper>
                            <Eth>
                                { ethBalance ? Number.parseFloat(ethers.utils.formatEther(ethBalance)).toPrecision(3) : "0" } ETH
                                </Eth>
                            <Account>
                                { userAddress ? userAddress.slice(0, 5) + "..." + userAddress.slice(38, 42) : null }
                            </Account>
                        </AccountWrapper>
                    </SubContainer>
                </Container>
            </MetaContainer>
    )
}