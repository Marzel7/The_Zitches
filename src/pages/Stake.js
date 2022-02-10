import React, { useState, useEffect } from "react";
import {
  useEtherBalance,
  useContractFunction,
  useEthers,
  useGasPrice,
  useNotifications,
} from "@usedapp/core";

import { Stack, Text, Box, Flex, Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import { formatBalance } from "../helpers.js";
import { Contract } from "@ethersproject/contracts";
import humanizeDuration from "humanize-duration";
import {
  useTimeLeftCall,
  useBalanceCall,
  useThresholdCall,
  useCompleteCall,
} from "../hooks";

// import ABI
import StakerContract from "../contracts/abis/Staker.json";
import FundManagerContract from "../contracts/abis/FundManager.json";

// import contract address
import adrs from "../contracts/contract-address.json";

const Balance = () => {
  let staker, fundManager, networkId;
  const { account, chainId } = useEthers();

  try {
    chainId === 1337 ? (networkId = chainId) : (networkId = chainId);

    staker = new Contract(adrs.stakerAddr, StakerContract.abi);
    fundManager = new Contract(adrs.fundManagerAddr, FundManagerContract.abi);
  } catch (err) {
    console.log(err);
  }
  // Staker hooks
  const { send: stake } = useContractFunction(staker, "stake", {});
  const { send: withdraw } = useContractFunction(staker, "withdraw", {});
  const { send: execute } = useContractFunction(staker, "execute", {});

  const timeLeft = useTimeLeftCall();
  const gasPrice = useGasPrice();
  const threshold = useThresholdCall();

  // FundManager hooks
  const complete = useCompleteCall();

  // Ethers hooks
  const userStakedBalance = useBalanceCall(account);
  const userBalance = useEtherBalance(account);
  const stakingBalance = useEtherBalance(adrs.stakerAddr);

  const [disableStakeBtn, setDisabledStakeBtn] = useState(false);
  const [disableWithdrawBtn, setDisabledWithdrawBtn] = useState(true);
  const [disableExecuteBtn, setDisabledExecuteBtn] = useState(false);

  // notifications
  const { notifications } = useNotifications();

  useEffect(() => {
    if (stakingBalance >= threshold) {
      setDisabledStakeBtn(true);
      setDisabledWithdrawBtn(true);
    }
  }, [stakingBalance]);

  useEffect(() => {
    if (complete == true) {
      setDisabledExecuteBtn(true);
      setDisabledStakeBtn(true);
      setDisabledWithdrawBtn(true);
    }
  }, [complete]);

  useEffect(() => {
    if (userStakedBalance > 0) {
      setDisabledWithdrawBtn(false);
    } else {
      setDisabledWithdrawBtn(true);
    }
  }, [userStakedBalance]);

  const handleStake = () => {
    const options = { value: ethers.utils.parseEther("0.01") };
    stake(options);
  };

  const handleWithdraw = () => {
    withdraw(account);
  };

  const handleExecute = () => {
    execute();
  };

  const withdrawOrExecuteSelect = () => {
    if (timeLeft <= 0) {
      return <Box></Box>;
    }
    if (stakingBalance < threshold && complete[0] == false) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleWithdraw()}
          disabled={disableWithdrawBtn}
        >
          withdraw
        </Button>
      );
    } else if (complete[0] == true) {
      return <Box></Box>;
    } else {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExecute()}
          disabled={disableExecuteBtn}
        >
          execute
        </Button>
      );
    }
  };

  const stakeSelect = () => {
    if (timeLeft <= 0) {
      return <Box>Staking period has expired</Box>;
    }
    if (complete[0] == false) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStake()}
          disabled={disableStakeBtn}
        >
          stake eth
        </Button>
      );
    } else if (complete[0]) {
      return <Box>Staking balance reached</Box>;
    }
  };

  const contractBalanceSelect = () => {
    if (timeLeft <= 0) {
      return <Box></Box>;
    }
    if (complete[0] == false) {
      return (
        <Stack isInline spacing={0.5} align="baseline" spacing={1}>
          <Text>ETH2 staking contract holds:</Text>
          <Text color="gray.500">
            {ethers.utils.formatEther(stakingBalance)}
            {""}
          </Text>
          <Text> / {ethers.utils.formatEther(threshold[0]).toString()}</Text>
          <Text>eth</Text>
        </Stack>
      );
    } else {
      return <Box></Box>;
    }
  };

  return (
    <>
      <Box w="720px" ml="350px" textStyle="h1">
        <Stack justify="space-between" p={2}>
          <Text>Stake</Text>
        </Stack>
        <Box>
          <Stack>
            {account ? (
              <Box textStyle="h2">
                <Stack isInline>
                  <Text>Account:</Text>
                  <Text color="gray.500">{account}</Text>
                </Stack>
              </Box>
            ) : (
              <Box textStyle="h2">
                <Text>Account:</Text>
              </Box>
            )}
            {userBalance ? (
              <Box textStyle="h2">
                <Stack isInline spacing={0.5}>
                  <Text>Ether balance:</Text>
                  <Text color="gray.500">{formatBalance(userBalance)}</Text>
                  <Text>eth</Text>
                </Stack>
              </Box>
            ) : (
              <Box>
                <Text textStyle="h2">Ether balance:</Text>
              </Box>
            )}
            {timeLeft ? (
              <Box textStyle="h2">
                <Stack isInline spacing={0.5}>
                  <Text>Time remaining:</Text>
                  <Text color="gray.500">
                    {humanizeDuration(timeLeft * 1000)}
                    {""}
                  </Text>
                  <Text></Text>
                </Stack>
              </Box>
            ) : (
              <Stack>
                <Box textStyle="h2">
                  <Text>Time remaining:</Text>
                </Box>
                <Box textStyle="h5" py={5}>
                  Please connect metamask account on Rinkeby to begin staking
                  Eth
                </Box>
              </Stack>
            )}
          </Stack>
          <Stack>
            <Flex></Flex>
            {complete && <Box py={5}>{stakeSelect()}</Box>}
            {userStakedBalance && (
              <Box textStyle="h2">
                <Stack isInline spacing={0.5}>
                  <Text>Your staked balance:</Text>
                  <Text color="gray.500">
                    {ethers.utils.formatEther(userStakedBalance.toString())}
                    {""}
                  </Text>
                  <Text>eth</Text>
                </Stack>
              </Box>
            )}
          </Stack>
          <Stack spacing={1}>
            {" "}
            {complete && <Box py={5}>{withdrawOrExecuteSelect()}</Box>}
            {stakingBalance && threshold && (
              <Box textStyle="h2">{contractBalanceSelect()}</Box>
            )}
          </Stack>
        </Box>
      </Box>
      <Box w="720px" ml="10px" textStyle="h1" px={50}>
        <Stack justify="space-between" py={150}>
          <Text></Text>
        </Stack>
      </Box>
    </>
  );
};

export default Balance;
