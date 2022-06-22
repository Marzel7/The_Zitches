pragma solidity >=0.8.0 <0.9.9;
import "hardhat/console.sol";

// //SPDX-License-Identifier: Unlicense

contract Fallback {
    event ReceiveEvent(string func, address sender, uint256 value, bytes data);
    event FallbackEvent(string func, address sender, uint256 value, bytes data);

    receive() external payable {
        emit ReceiveEvent("Receive", msg.sender, msg.value, "");
    }

    fallback() external payable {
        emit FallbackEvent("Fallback", msg.sender, msg.value, msg.data);
    }
}

contract CallFallback {
    function payContract(address receiver) public payable {
        (bool success, ) = receiver.call{value: msg.value}("");
        require(success, "TX failed");
    }
}
