// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract myToken is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _totalSupply);
    }
}

contract myExchange {
    address tokenAddress;

    constructor(address _token) {
        require(_token != address(0));
        tokenAddress = _token;
    }

    function addLiquidity(uint256 _tokenAmount) public {
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _tokenAmount);
    }

    function getReserve() public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    function getPrice(uint256 inputReserve, uint256 outputReserve)
        public
        pure
        returns (uint256)
    {
        require(
            inputReserve > 0 && outputReserve > 0,
            "Reserve must be greater than 0"
        );
        // x 1000 to account for floor rounding
        return ((inputReserve * 1000) / outputReserve);
    }

    function getAmount(
        uint256 _inputAmount,
        uint256 _inputReserve,
        uint256 _outputReserve
    ) private pure returns (uint256) {
        require(_inputReserve > 0 && _outputReserve > 0, "insufficient funds");
        return (_inputAmount * _outputReserve) / (_inputReserve + _inputAmount);
    }

    function getTokenAmount(uint256 _ethSold) public view returns (uint256) {
        require(_ethSold > 0, "eth value must be greater than 0");
        uint256 tokenReserve = getReserve();
        return getAmount(_ethSold, address(this).balance, tokenReserve);
    }

    function getEthAmount(uint256 _tokenSold) public view returns (uint256) {
        require(_tokenSold > 0, "token amount must be greater than 0");
        uint256 tokenReserve = getReserve();
        return getAmount(_tokenSold, tokenReserve, address(this).balance);
    }

    function ethToTokenSwap(uint256 _minTokens) public payable {
        uint256 tokenReserve = getReserve();
        uint256 tokensBought = getAmount(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );

        require(tokensBought >= _minTokens, "insufficient output amount");
        IERC20(tokenAddress).transfer(msg.sender, tokensBought);
    }

    function tokenToEthSwap(uint256 _tokensSold, uint256 _minEth) public {
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmount(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );

        require(ethBought >= _minEth, "insufficient output amount");
        IERC20(tokenAddress).transfer(address(this), _tokensSold);
        payable(msg.sender).transfer(ethBought);
    }
}
