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
    function functionSelector(string calldata func)
        external
        pure
        returns (bytes4)
    {
        return bytes4(keccak256(bytes(func)));
    }

    function payContract(address _addr, bytes memory _data)
        public
        payable
        returns (bool, bytes memory)
    {
        (bool success, bytes memory result) = _addr.call{value: msg.value}(
            _data
        );

        require(success, "call: revert");
        return (success, result);
    }
}
