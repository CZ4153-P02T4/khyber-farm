import React from "react"
import styled from "styled-components";
import { ethers } from "ethers";

import { useUser } from "../context/UserContext"
import { useContract } from "../context/ContractContext"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 2rem;
`;

const Box = styled.div`
    height: 15rem;
    width: 22rem;
    background: #2c303a;
    border-radius: 10px;
    padding: .4rem;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
`;

const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
    color: white;
`

const Banner = styled.div`
    width: 100%;
    height: 33%;
    color: white;
    background-color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ClaimButton = styled.button`
    height: 5rem;
    width: 100%;
    background-color: rgb(68, 72, 87);
    border: 3px;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    cursor: pointer;
    :hover {
        background-color: rgb(90, 95, 115)
    }
`;

const TopBanner = styled.div`
    align-self: center;
    font-size: 1.65rem;
    font-weight: bold;
    color: green;
    text-shadow: .03rem .03rem #ED7014;
`;

const BottomBanner = styled.div`
    align-self: center;
    font-size: 1rem;
    font-weight: bold;
`;

const Circle = styled.button`
    width: 12rem;
    height: 4rem;
    border: none;
    border-radius: 1rem;
    background-color: transparent;
    color: white;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default function StakeBox() {

    const {
        stakingBalance,
        khyberYield,
        khyberUnrealizedYield,
    } = useUser();

    const {
        provider,
        khyberFarmContract
    } = useContract();

    const withdrawYield = async() => {
        let signer = provider.getSigner()
        let tx = await khyberFarmContract.connect(signer).withdrawYield()
        return tx
    }
    
    const accruing = khyberYield / 1e18
    const unrealized = khyberUnrealizedYield ? khyberUnrealizedYield / 1e18 : 0

    return(
        <Container>
            <Title>
                Claim Rewards
            </Title>
        <Box>
            <Banner>
                <TopBanner>
                    <div>
                        { parseFloat(accruing + unrealized).toFixed(3) } KHYBER
                    </div>
                </TopBanner>
            </Banner>
                <BottomBanner>
                    <Circle>
                        <span>Rate: <b>{ stakingBalance ? ethers.utils.formatEther(stakingBalance) : "0" } / day</b></span>
                    </Circle>
                </BottomBanner>
            <div>
                <ClaimButton onClick={withdrawYield}>
                    Claim
                </ClaimButton>
            </div>
        </Box>
        </Container>
    )
}