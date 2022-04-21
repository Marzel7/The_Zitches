// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";
import "hardhat/console.sol";

contract Vendor is Ownable {
    uint256 public constant tokensPerEth = 1;
    Token public token;
    event BuyTokens(address sender, uint256 amount, uint256 tokensPerEth);
    event SellTokens(address sender, uint256 amount, uint256 tokensPerEth);

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }

    function buyTokens() external payable {
        uint256 amountOfTokens = msg.value * tokensPerEth;
        require(msg.value != 0, "Insufficient Eth for transfer");

        bool sent = token.transfer(msg.sender, amountOfTokens);
        require(sent, "Failed to transfer tokens");
        emit BuyTokens(msg.sender, msg.value, amountOfTokens);
    }

    function sellTokens(uint256 _amount) external payable {
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= _amount, "You don't have enough allowance");

        bool tokenSuccess = token.transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        require(tokenSuccess, "token transfer failed");

        uint256 backEth = _amount / tokensPerEth;
        (bool ethSuccess, ) = msg.sender.call{value: backEth}("");
        require(ethSuccess, "transfer eth back failed");
        emit SellTokens(msg.sender, backEth, _amount);
    }

    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "withdraw failure");
    }
}
