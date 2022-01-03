pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 storedData = 10;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }

    function name() public view returns (uint256) {
        return 1;
    }
}