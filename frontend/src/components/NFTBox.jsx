import React from "react"
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 2rem;
`;

const Box = styled.div`
    height: 25rem;
    width: 22rem;
    background: linear-gradient(45deg, #5f3c74, #ED7014);
    padding: .4rem;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    border: .3rem solid black;
`;

const Banner = styled.div`
    width: 100%;
    height: 25%;
    background-color: rgba(24,24,24,1);
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
`;

const BottomBanner = styled.div`
    font-size: 1.4rem;
    font-weight: bold;
    display: flex;
    align-self: center;
    align-items: center;
`;

const Circle = styled.button`
    width: 12rem;
    height: 4rem;
    border: .05rem dashed white;
    border-radius: 1rem;
    background-color: transparent;
    border: none;
    color: white;
`;

export default function NFTBox() {
    
    return(
        <Container>
        <Box>
            <Banner>
                <TopBanner>
                    <div>
                        Khyber Crystal
                    </div>
                </TopBanner>
            </Banner>
        
            <BodyDiv>
                <ul>
                    <Li>
                        Purchase a Khyber Crystal NFT for 1 KHYBER
                    </Li>
                    <Li>
                        Each minted Khyber Crystal NFT doubles as a lottery ticket
                    </Li>
                    <Li>
                        All KHYBER goes toward the lottery pool to win back
                    </Li>
                    <Li>
                        Click on the NFT tab above to mint an NFT
                    </Li>
                </ul>
            </BodyDiv>

            <Banner>
                <BottomBanner>
                    <Circle>
                        <div>
                            Cost: 1 KHYBER
                        </div>
                    </Circle>
                </BottomBanner>
            </Banner>
        </Box>
        </Container>
    )
}
