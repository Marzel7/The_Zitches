// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20("ERC20", "TOK") {
    uint256 private _totalSupply = 10000 * 10**18;

    constructor() {
        _mint(msg.sender, _totalSupply);
    }
}
