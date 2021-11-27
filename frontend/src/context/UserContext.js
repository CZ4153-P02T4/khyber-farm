import React, { useContext } from 'react'

export const UserContext = React.createContext({
    userAddress: "",
    setUserAddress: () => [],
    ethBalance: "",
    setEthBalance: () => {},
    daiBalance: "",
    setDaiBalance: () => {},
    khyberBalance: "",
    setKhyberBalance: () => {},
    stakingBalance: "",
    setStakingBalance: () => {},
    khyberYield: "",
    setKhyberYield: () => {},
    khyberUnrealizedYield: "",
    setKhyberUnrealizedYield: () => {},
    userNFTs: "",
    setUserNFTs: () => {},
})

export const UserProvider = UserContext.Provider
export const useUser = () => useContext(UserContext)