// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Token.sol";

contract Vendor {
    Token public token;

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }

    function buyTokens(uint256 _amount) public {
        token.transfer(msg.sender, _amount);
    }
}
