import React from "react"
import styled from "styled-components";
import { ethers } from "ethers" 

import { useUser } from "../context/UserContext"
import { useContract } from "../context/ContractContext"

import NFTBox from "./NFTBox";

const ModalStyle ={
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black',
    borderRadius: '2rem',
    height: '50%',
    width: '60%',
    zIndex: 1000
}

const OverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`;

const H1 = styled.h1`
    background: linear-gradient(45deg, #5f3c74, #ED7014);
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
    position: fixed;
    font-size: 4rem;
    top:-6.4rem;
    left: 5%;
`;

const MintButton = styled.button`
    background: linear-gradient(45deg, #5f3c74, #ED7014);
    font-size: 1.5rem;
    color: white;
    width: 150%;
    height: 4rem;
    margin-left: -25%;
    cursor: pointer;
`;

const DivBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 20rem;
    width: 18rem;
    margin: 3rem 0 2rem 0;
    align-items: center;
    background-color: transparent;
    border: .1rem solid black;
    border-radius: 1rem;
    color: white;
`;

const Img = styled.img`
    height: 20rem;
    width: 20rem;
`;

const BottomDiv = styled.div`
    height: 20%;
`;

const Horizontal = styled.div`
    display: flex;
    flex-direction: row;
`

export default function LotteryModal() {

    const {
        userAddress
    } = useUser();

    const {
        provider,
        khyberFarmContract,
        khyberTokenContract,
        lotteryContract,
        setIsNFTOpen
    } = useContract();

    function closeModal() {
        setIsNFTOpen(false)
    }

    const URI = "https://media.giphy.com/media/aaoR7auCe3Hj0Np9M4/giphy.gif"

    const mintKhrystal = async() => {
        try {
            let signer = provider.getSigner()
            let tx = await khyberTokenContract.connect(signer).approve(
                lotteryContract.address, ethers.utils.parseEther("1")
                )
            provider.waitForTransaction(tx.hash)
                .then(async() => {
                    tx = await khyberFarmContract.connect(signer).mintNFT(userAddress, URI)
                })
                return tx
        } catch (error) {
            alert(error)
        }
    }
    

return(
    <>
        <div style={OverlayStyle} onClick={closeModal}/>
        <div style={ModalStyle}>
        <H1>Mint NFT</H1>
            <Horizontal>
                <NFTBox/>
                <Container>
                    <DivBody>
                        <Img src={URI} alt="display image"/>
                    </DivBody>
                    <BottomDiv>
                        <MintButton onClick={mintKhrystal}>
                            MINT KHRYSTAL NFT
                        </MintButton>
                    </BottomDiv>
                </Container>
            </Horizontal>
        </div>
    </>
    )
}