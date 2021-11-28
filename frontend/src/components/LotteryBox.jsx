import React from "react"
import styled from "styled-components";

import { useContract } from "../context/ContractContext"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 2rem;
`;

const Box = styled.div`
    height: 25rem;
    width: 22rem;
    background: linear-gradient(45deg, #5f3c74, green);
    padding: .4rem;
    background-color: #2b2e35;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    border: .3rem solid black;
`;

const Banner = styled.div`
    width: 100%;
    height: 25%;
    background: rgba(24,24,24,0.95);
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const BodyDiv = styled.div`
    width: 100%;
    background-color: black;
    color: white;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Li = styled.li`
    margin: .5rem;
`;

const TopBanner = styled.div`
    align-self: center;
    font-size: 1.65rem;
    font-weight: bold;
    color: white;
    text-shadow: .03rem .03rem gray;
`;

const BottomBanner = styled.div`
    align-self: center;
    font-size: 1.4rem;
    font-weight: bold;
`;

const Circle = styled.button`
    width: 12rem;
    height: 4rem;
    border-radius: 1rem;
    border: none;
    background-color: transparent;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default function LotteryBox() {

    const {
        lotteryBalance,
    } = useContract();
    
    return(
        <Container>
        <Box>
            <Banner>
                <TopBanner>
                    <div>
                        Khrystal Lottery
                    </div>
                </TopBanner>
            </Banner>
        
            <BodyDiv>
                <ul>
                    <Li>
                        Each minted Khrystal-O'-Lantern NFT doubles as a lottery ticket
                    </Li>
                    <Li>
                        The tokenId of the KHRYSTAL NFT is your lottery ticket number
                    </Li>
                    <Li>
                        Winning number is verifiably random using Chainlink's VRF
                    </Li>
                    <Li>
                        Click on the Lottery tab above to see the results of the latest lottery
                    </Li>
                </ul>
            </BodyDiv>

            <Banner>
                <BottomBanner>
                    <Circle>
                        Prize Pool: 
                        <div>
                            {lotteryBalance ? lotteryBalance : "0"} KHYBER
                        </div>
                    </Circle>
                </BottomBanner>
            </Banner>
        </Box>
        </Container>
    )
}