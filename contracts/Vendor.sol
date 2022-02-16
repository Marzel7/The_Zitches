// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Token.sol";

contract Vendor {
    Token public token;
    event BuyTokens(address sender, uint256 amount);

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }

    function buyTokens(address _sender, uint256 _amount) public {
        token.transfer(_sender, _amount);
        emit BuyTokens(_sender, _amount);
    }
}
