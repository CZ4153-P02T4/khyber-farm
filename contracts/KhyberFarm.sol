// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./KhyberToken.sol";
import "./KhyberCrystal.sol";

contract KhyberFarm {

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public khyberBalance;

    string public name = "Khyber Farm";

    IERC20 public kncToken;
    KhyberToken public khyberToken;
    KhyberCrystal public khrystal;

    uint256 private nftPrice;
    uint256 public contractKhyberBalance;

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event YieldWithdraw(address indexed to, uint256 amount);
    event MintNFT(address indexed to, uint256 indexed tokenId);

    constructor(
        IERC20 _kncToken,
        KhyberToken _khyberToken,
        KhyberCrystal _khrystal,
        uint256 _nftPrice
        ) {
            kncToken = _kncToken;
            khyberToken = _khyberToken;
            khrystal = _khrystal;
            nftPrice = _nftPrice;
        }

    function stake(uint256 amount) public {
        require(
            amount > 0 &&
            kncToken.balanceOf(msg.sender) >= amount, 
            "You cannot stake zero tokens");

        if(isStaking[msg.sender] == true){
            uint256 toTransfer = calculateYieldTotal(msg.sender);
            khyberBalance[msg.sender] += toTransfer;
        }

        kncToken.transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        emit Stake(msg.sender, amount);
    }

    /// @notice Retrieves funds locked in contract and sends them back to user
    /// @dev The yieldTransfer variable transfers the calculatedYieldTotal result to khyberBalance
    ///      in order to save the user's unrealized yield
    /// @param amount The quantity of KNC the user wishes to receive
    function unstake(uint256 amount) public {
        require(
            isStaking[msg.sender] = true &&
            stakingBalance[msg.sender] >= amount, 
            "Nothing to unstake"
        );
        uint256 yieldTransfer = calculateYieldTotal(msg.sender);
        uint256 balTransfer = amount;
        amount = 0;
        stakingBalance[msg.sender] -= balTransfer;
        kncToken.transfer(msg.sender, balTransfer);
        khyberBalance[msg.sender] += yieldTransfer;
        if(stakingBalance[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }
        emit Unstake(msg.sender, balTransfer);
    }

    /// @notice Helper function for determining how long the user staked
    /// @dev Kept visibility public for testing
    /// @param user The user
    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    /// @notice Calculates the user's yield while using a 86400 second rate (for 100% returns in 24 hours)
    /// @dev Solidity does not compute fractions or decimals; therefore, time is multiplied by 10e18
    ///      before it's divided by the rate. rawYield thereafter divides the product back by 10e18
    /// @param user The user
    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user) * 10**18;
        uint256 rate = 86400;
        uint256 timeRate = time / rate;
        uint256 rawYield = (stakingBalance[user] * timeRate) / 10**18;
        return rawYield;
    } 

    /// @notice Transfers accrued KHYBER yield to the user
    /// @dev The if conditional statement checks for a stored KHYBER balance. If it exists, the
    ///      the accrued yield is added to the accruing yield before the KHYBER mint function is called
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

    /// @notice
    /// @dev 
    /// @param user g
    /// @param tokenURI g
    function mintNFT(address user, string memory tokenURI) public {
        require(
            khyberToken.balanceOf(msg.sender) >= nftPrice, 
            "Not enough KHYBER"
        );
        khyberToken.transferFrom(msg.sender, address(this), nftPrice);
        uint256 tokenId = khrystal.mintItem(user, tokenURI);
        contractKhyberBalance += nftPrice;
        emit MintNFT(msg.sender, tokenId);
    }
}