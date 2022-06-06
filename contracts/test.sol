//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IExchange {
    function ethToTokenSwap(uint256 _minTokens) external payable;

    function ethToTokenTransfer(uint256 _minTokens, address _recipient)
        external
        payable;
}

contract Exchange {
    address public tokenAddress;
    address public factoryAddress;

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
        factoryAddress = msg.sender;
    }

    function addLiquidity(uint256 _amount) public {
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function getReserve() public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    function getEthAmount(uint256 _tokenSold) public view returns (uint256) {
        require(_tokenSold > 0, "tokenSold is too small");
        uint256 reserve = getReserve();

        return getAmount(_tokenSold, reserve, address(this).balance);
    }

    function getTokenAmount(uint256 _ethSold) public view returns (uint256) {
        require(_ethSold > 0, "_ethSold is too low");
        uint256 reserve = getReserve();
        return getAmount(_ethSold, address(this).balance, reserve);
    }

    function ethToToken(uint256 _minTokens, address recipient) private {
        uint256 reserve = getReserve();
        uint256 tokensBought = getAmount(
            msg.value,
            address(this).balance - msg.value,
            reserve
        );
        require(_minTokens >= tokensBought, "Not enough tokens");
        IERC20(tokenAddress).transfer(recipient, tokensBought);
    }

    function ethToTokenSwap(uint256 _minTokens) public payable {
        ethToToken(_minTokens, msg.sender);
    }

    function ethToTokenTransfer(uint256 _minTokens, address _recipient)
        public
        payable
    {
        ethToToken(_minTokens, _recipient);
    }

    function tokenToEthSwap(uint256 _tokenSold, uint256 _minEth) public {
        uint256 reserve = getReserve();
        uint256 ethAmount = getAmount(
            _tokenSold,
            reserve,
            address(this).balance
        );
        require(ethAmount >= _minEth, "Not enough Eth");

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokenSold
        );
        payable(msg.sender).transfer(ethAmount);
    }

    function getAmount(
        uint256 _inputAmount,
        uint256 _inputReserve,
        uint256 _outputReserve
    ) private pure returns (uint256) {
        require(
            _inputReserve > 0 && _outputReserve > 0,
            "liquidity is too low"
        );

        return (_inputAmount * _outputReserve) / (_inputReserve + _inputAmount);
    }

    function tokenToTokenSwap(
        uint256 _tokensSold,
        uint256 _minTokenAmount,
        address _tokenAddress
    ) public {
        address exchangeAddress = IFactory(factoryAddress).getExchange(
            _tokenAddress
        );
        require(
            exchangeAddress == address(0) && exchangeAddress != address(this),
            "invalid exchange address"
        );
        uint256 _tokenReserve = getReserve();
        uint256 ethBought = getAmount(
            _tokensSold,
            _tokenReserve,
            address(this).balance
        );

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        IExchange(exchangeAddress).ethToTokenTransfer{value: ethBought}(
            _minTokenAmount,
            msg.sender
        );
    }
}

interface IFactory {
    function createExchage(address _tokenAddress) external returns (address);

    function getExchange(address _tokenAddress) external view returns (address);
}

contract Factory {
    mapping(address => address) tokenAddressToExchange;

    function createExchage(address _tokenAddress) public returns (address) {
        require(_tokenAddress != address(this), "invalid token address");
        require(
            tokenAddressToExchange[_tokenAddress] == address(0),
            "exchange already exists"
        );

        Exchange exchange = new Exchange(_tokenAddress);
        tokenAddressToExchange[_tokenAddress] = address(exchange);
        return address(exchange);
    }

    function getExchange(address _tokenAddress) public view returns (address) {
        return tokenAddressToExchange[_tokenAddress];
    }
}
