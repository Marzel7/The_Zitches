// //SPDX-License-Identifier: Unlicense
// pragma solidity ^0.8.0;

// import "./ExchangeB.sol";

// contract Factory {
//     mapping(address => address) public tokenToExchange;

//     function createExchange(address _tokenAddress) public returns (address) {
//         require(_tokenAddress != address(0), "invalid token address");
//         require(
//             tokenToExchange[_tokenAddress] == address(0),
//             "token already exists"
//         );
//         ExchangeB exchange = new ExchangeB(_tokenAddress);
//         tokenToExchange[_tokenAddress] = address(exchange);

//         return address(exchange);
//     }

//     function getExchange(address tokenAddress) public view returns (address) {
//         return (tokenToExchange[tokenAddress]);
//     }
// }
