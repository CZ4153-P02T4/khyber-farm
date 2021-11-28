import React from "react"
import styled from "styled-components";
import { ethers } from "ethers";

import StakeBox from "./StakeBox"
import ClaimBox from "./ClaimBox"

import { useUser } from "../context/UserContext"

const Container = styled.div`
    display: flex;
    justify-content: center;
`;

const Card = styled.div`
    height: 60rem;
    width: 60rem;
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const CardBanner = styled.div`
    width: 90%;
    height: 3rem;
    background-color: #2b2e35;
    margin-top: 2rem;
    border: .1rem solid black;
    border-radius: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.2rem;
`;

const AlignBox = styled.div`
    display: flex;
    align-items: center;
`;

export default function MainCard() {

    const {
        khyberBalance
    } = useUser();

    return(
        <Container>
            <Card>
                <AlignBox>
                    <StakeBox />
                    <ClaimBox />
                </AlignBox>
                <CardBanner>
                    KHYBER Balance: {khyberBalance ? Number.parseFloat(ethers.utils.formatEther(khyberBalance)).toFixed(3).toString() : "0"}
                </CardBanner>
            </Card>
        </Container>
    )
}
