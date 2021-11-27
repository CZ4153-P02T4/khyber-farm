// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./KhyberCrystal.sol";
import "./KhyberToken.sol";

/// @title Lottery
/// @author Andrew Fleming
/// @notice This contract adds a lottery feature to the KhyberFarm contract that uses
///         the NFT tokenId as the "ticket." This contract uses Chainlink's VRF to 
///         achieve verifiable randomness for the winning number
/// @dev Basic iteration of a lottery feature in the KhyberFarm dApp. KhyberFarm's mintNFT
///      function includes a transfer invokation which funds the lotteryPool. The internal
///      validateWinner function uses ERC721 Enumerable's tokenOfOwnerByIndex function to
///      iterate and validate the user holds the winning tokenId number

contract Lottery is Ownable, VRFConsumerBase {

    uint256 private lotteryPool;
    uint256 public lotteryCount;
    uint256 internal fee;
    bytes32 internal keyHash;

    KhyberCrystal public khrystal;
    KhyberToken public phyberToken;
    IERC20 public linkToken;
    
    // lotteryCount => winningNumber
    mapping(uint256 => uint256) public winningNumber;
    // requestId => lotteryCount
    mapping(bytes32 => uint256) public requestIdToCount;

    event LotteryStart(uint256 indexed _lotteryCount, bytes32 indexed _requestId);
    event NumberReceived(bytes32 indexed _requestId, uint256 indexed _winningNumber);
    event LotteryClaim(address indexed winner, uint256 indexed amount);
    event WithdrawLink(address indexed from, uint256 indexed amount);

    /// @notice Sets the necessary contract instances, addresses, and values for
    ///         Chainlink's VRF
    /// @dev Params from _coorAddress to _keyHash necessary for Chainlink's VRF. Preceding
    ///      params used for contract instances
    constructor(
        KhyberCrystal _khrystal,
        KhyberToken _phyberToken,
        IERC20 _linkToken,
        address _coorAddress,
        address _linkAddress,
        uint256 _fee,
        bytes32 _keyHash
        ) VRFConsumerBase (
            _coorAddress,
            _linkAddress
        ) {
        khrystal = _khrystal;
        phyberToken = _phyberToken;
        linkToken = _linkToken;
        fee = _fee;
        keyHash = _keyHash;
    }
    
    function getWinningNumber() public onlyOwner {
        bytes32 requestId = getRandomNumber();
        requestIdToCount[requestId] = lotteryCount;
        emit LotteryStart(lotteryCount, requestId);
        lotteryCount++;
    }

    function getRandomNumber() internal returns(bytes32 requestId){
        uint256 userSeed = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1))));
        return requestRandomness(keyHash, fee, userSeed);
    }

    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        uint256 totalIds = khrystal.getTotalSupply();
        uint256 winningNum = _randomness % totalIds;
        winningNumber[requestIdToCount[_requestId]] = winningNum;
        emit NumberReceived(_requestId, winningNum);
    }

    function addToLotteryPool(address from, uint256 phyber) public {
        require(phyber > 0, "Cannot add zero");
        lotteryPool += phyber;
        phyberToken.transferFrom(from, address(this), phyber);
    }

    function validateWinner(
        address user 
        ) internal 
        returns(bool)
        {
        uint256 totalNfts = khrystal.balanceOf(user);
        uint256 winNum = winningNumber[lotteryCount - 1];
        unchecked {
            for(uint256 i; i < totalNfts; i++){
                if(khrystal.tokenOfOwnerByIndex(user, i) == winNum){
                    return true;
                }
            }
        }
    }

    function claimLottoWinnings() public {
        require(
            validateWinner(msg.sender) &&
            lotteryPool > 0,
            "You either did not win or nothing in lotteryPool"
            );
        uint256 toTransfer = lotteryPool;
        lotteryPool = 0;
        phyberToken.transfer(msg.sender, toTransfer);
        emit LotteryClaim(msg.sender, toTransfer);
    }

    function withdrawLink() public onlyOwner {
        uint256 toTransfer = linkToken.balanceOf(address(this));
        linkToken.transfer(msg.sender, toTransfer);
        emit WithdrawLink(msg.sender, toTransfer);
    }

    function getLinkBalance() public view returns(uint256){
        return linkToken.balanceOf(address(this));
    }
}
