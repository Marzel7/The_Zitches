pragma solidity >=0.8.0 <0.9.9;
// //SPDX-License-Identifier: Unlicense

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Monyo is ERC20 {
    constructor(address account, uint256 totalSupply) ERC20("Monyo", "MON") {
        _mint(account, totalSupply);
    }
}
