// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./KhyberToken.sol";
import "./KhyberCrystal.sol";
import "./Lottery.sol";

contract KhyberFarm {

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public khyberBalance;
    mapping(string => uint256) public nftCount;    

    string public name = "Khyber Farm";

    IERC20 public daiToken;
    KhyberToken public khyberToken;
    KhyberCrystal public khrystal;
    Lottery public lottery;

    uint256 private nftPrice;

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event YieldWithdraw(address indexed to, uint256 amount);
    event MintNFT(address indexed to, uint256 indexed tokenId);

    constructor(
        IERC20 _daiToken,
        KhyberToken _khyberToken,
        KhyberCrystal _khrystal,
        Lottery _lottery,
        uint256 _nftPrice
        ) {
            daiToken = _daiToken;
            khyberToken = _khyberToken;
            khrystal = _khrystal;
            lottery = _lottery;
            nftPrice = _nftPrice;
        }

    function stake(uint256 amount) public {
        require(
            amount > 0 &&
            daiToken.balanceOf(msg.sender) >= amount, 
            "You cannot stake zero tokens");

        if(isStaking[msg.sender] == true){
            uint256 toTransfer = calculateYieldTotal(msg.sender);
            khyberBalance[msg.sender] += toTransfer;
        }

        daiToken.transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        emit Stake(msg.sender, amount);
    }

    function unstake(uint256 amount) public {
        require(
            isStaking[msg.sender] = true &&
            stakingBalance[msg.sender] >= amount, 
            "Nothing to unstake"
        );
        uint256 yieldTransfer = calculateYieldTotal(msg.sender);
        startTime[msg.sender] = block.timestamp;
        uint256 balTransfer = amount;
        amount = 0;
        stakingBalance[msg.sender] -= balTransfer;
        daiToken.transfer(msg.sender, balTransfer);
        khyberBalance[msg.sender] += yieldTransfer;
        if(stakingBalance[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }
        emit Unstake(msg.sender, balTransfer);
    }

    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user) * 10**18;
        uint256 rate = 86400;
        uint256 timeRate = time / rate;
        uint256 rawYield = (stakingBalance[user] * timeRate) / 10**18;
        return rawYield;
    } 

    function withdrawYield() public {
        uint256 toTransfer = calculateYieldTotal(msg.sender);

        require(
            toTransfer > 0 ||
            khyberBalance[msg.sender] > 0,
            "Nothing to withdraw"
            );
            
        if(khyberBalance[msg.sender] != 0){
            uint256 oldBalance = khyberBalance[msg.sender];
            khyberBalance[msg.sender] = 0;
            toTransfer += oldBalance;
        }

        startTime[msg.sender] = block.timestamp;
        khyberToken.mint(msg.sender, toTransfer);
        emit YieldWithdraw(msg.sender, toTransfer);
    } 

    function mintNFT(address user, string memory tokenURI) public {
        require(
            khyberToken.balanceOf(msg.sender) >= nftPrice, 
            "Not enough KHYBER"
        );
        lottery.addToLotteryPool(msg.sender, nftPrice);
        uint256 tokenId = khrystal.mintItem(user, tokenURI);
        nftCount[tokenURI]++;
        emit MintNFT(msg.sender, tokenId);
    }

}