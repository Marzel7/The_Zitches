pragma solidity >=0.8.0 <0.9.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DYDX is ERC20 {
    constructor() ERC20("DYDX", "DYDX") {
        _mint(msg.sender, 10000 ether); // mints 10000 DYDX!
    }
}
