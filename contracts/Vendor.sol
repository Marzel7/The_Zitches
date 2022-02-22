// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";
import "hardhat/console.sol";

contract Vendor is Ownable {
    uint256 public constant tokensPerEth = 10;
    Token public token;
    event BuyTokens(address sender, uint256 amount, uint256 tokensPerEth);

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }

    function buyTokens() public payable {
        require(msg.value != 0, "Insufficient Eth for transfer");
        require(
            msg.value * tokensPerEth <= token.balanceOf(address(this)),
            "Exceeds vendor token balance"
        );
        uint256 amountOfTokens = msg.value * tokensPerEth;
        token.transfer(msg.sender, amountOfTokens);
        emit BuyTokens(msg.sender, msg.value, amountOfTokens);
    }

    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        uint256 totalBalance = address(this).balance;
        payable(msg.sender).transfer(totalBalance);
    }
}
