// SPDX-License-Identifier: MIT
import "./FundManager.sol";
pragma solidity ^0.8.0;

contract Staker {
    FundManager public fundManager;

    constructor(address _fundManagerAddress) {
        fundManager = FundManager(_fundManagerAddress);
    }

    uint256 public threshold = 1 ether;
    uint256 public deadline = block.timestamp + 5 minutes;
    mapping(address => uint256) public balances;
    event Stake(address staker, uint256 amount);

    modifier deadlineExpired() {
        require(block.timestamp >= deadline, "deadline not expired");
        _;
    }

    modifier deadlineNotExpired() {
        require(block.timestamp < deadline, "already passed deadline");
        _;
    }

    modifier thresholdReached() {
        require(address(this).balance >= threshold, "Threshold not reached");
        _;
    }

    modifier thresholdNotReached() {
        require(address(this).balance < threshold, "Threshold reached");
        _;
    }

    function stake() public payable deadlineNotExpired {
        balances[msg.sender] += msg.value;
        emit Stake(msg.sender, msg.value);
    }

    function withdraw(address payable _to)
        public
        deadlineExpired
        thresholdNotReached
    {
        uint256 withdrawableAmount = balances[msg.sender];
        require(withdrawableAmount > 0, "Not enough balance");
        balances[msg.sender] = 0;
        (bool sent, ) = _to.call{value: withdrawableAmount}("");
        require(sent, "Failed to trasnfer Eth");
    }

    function execute() public thresholdReached deadlineExpired {}

    function timeLeft() public view returns (uint256) {
        return (block.timestamp > deadline ? 0 : block.timestamp - deadline);
    }

    receive() external payable {
        stake();
    }
}
