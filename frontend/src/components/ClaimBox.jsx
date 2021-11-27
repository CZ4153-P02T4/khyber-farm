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
    background-color: #2b2e35;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    border: .3rem solid black;
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
    background: linear-gradient(45deg, #2d1b38, #5f3c74);
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ClaimButton = styled.button`
    height: 5rem;
    width: 100%;
    background-color: black;
    color: #7A3803;
    font-size: 1.2rem;
    cursor: pointer;
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
    border: .05rem dashed #ED7014;
    border-radius: 1rem;
    background-color: transparent;
    color: yellow;
    font-size: 1rem;
    font-weight: bold;
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
            <div>
                <ClaimButton onClick={withdrawYield}>
                    Claim
                </ClaimButton>
            </div>
            <Banner>
                <BottomBanner>
                    <Circle>
                            Rate: { stakingBalance ? ethers.utils.formatEther(stakingBalance) : "0" } / day
                    </Circle>
                </BottomBanner>
            </Banner>
        </Box>
        </Container>
    )
}