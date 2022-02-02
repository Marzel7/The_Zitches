import React, { useState, useEffect } from "react";
import {
  useEtherBalance,
  useContractFunction,
  useEthers,
  useGasPrice,
} from "@usedapp/core";

import {
  Stack,
  Text,
  Box,
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { formatBalance } from "../helpers.js";
import { Contract } from "@ethersproject/contracts";
import humanizeDuration from "humanize-duration";
import { useTimeLeft, useBalanceCall } from "../hooks";

// import ABI
import StakerContract from "../contracts/abis/Staker.json";

// import contract address
import adrs from "../contracts/contract-address.json";

const Balance = () => {
  let staker, networkId;
  const { account, chainId } = useEthers();
  const timeLeft = useTimeLeft();
  const gasPrice = useGasPrice();
  const userStakedBalance = useBalanceCall(account);
  const userBalance = useEtherBalance(account);
  const stakingBalance = useEtherBalance(adrs.stakerAddr);

  try {
    chainId === 1337 ? (networkId = chainId) : (networkId = chainId);

    // contracts will be passed into useContractFunction
    staker = new Contract(adrs.stakerAddr, StakerContract.abi);
  } catch (err) {
    console.log(err);
  }

  const { send: stake } = useContractFunction(staker, "stake", {});
  const { send: withdraw } = useContractFunction(staker, "withdraw", {});
  const { send: execute } = useContractFunction(staker, "execute", {});

  const [disableStakeBtn, setDisabledStakeBtn] = useState(false);
  const [disableWithdrawBtn, setDisabledWithdrawBtn] = useState(false);
  const [disableExecuteBtn, setDisabledExecuteBtn] = useState(true);

  useEffect(() => {
    console.log("stakingBalance", stakingBalance);
    if (stakingBalance == 0) {
      setDisabledStakeBtn(false);
      setDisabledWithdrawBtn(true);
    } else if (stakingBalance >= 5) {
      setDisabledStakeBtn(false);
      setDisabledWithdrawBtn(false);
    } else if (stakingBalance > 0 && stakingBalance < 5) {
      setDisabledStakeBtn(true);
      setDisabledWithdrawBtn(true);
    }
  }, [stakingBalance]);

  useEffect(() => {
    console.log("timeLeft", timeLeft);
    if (timeLeft > 0) {
      setDisabledExecuteBtn(true);
    } else {
      setDisabledExecuteBtn(false);
      setDisabledStakeBtn(true);
      setDisabledWithdrawBtn(true);
    }
  }, [timeLeft]);

  const handleStake = () => {
    const options = { value: ethers.utils.parseEther("1") };
    stake(options);
  };

  const handleWithdraw = () => {
    withdraw(account);
  };

  const handleExecute = () => {
    execute();
  };

  return (
    <>
      <Box w="720px" ml="350px" textStyle="h1">
        <Stack justify="space-between" p={2}>
          <Text>Stake</Text>
        </Stack>
        <Box>
          <Stack>
            {account && (
              <Box textStyle="h2">
                <Stack isInline>
                  <Text>Account:</Text>
                  <Text color="gray.500">{account}</Text>
                </Stack>
              </Box>
            )}

            {userBalance && (
              <Box textStyle="h2">
                <Stack isInline spacing={0.5}>
                  <Text>Ether balance:</Text>
                  <Text color="gray.500">{formatBalance(userBalance)}</Text>
                  <Text>eth</Text>
                </Stack>
              </Box>
            )}
            {timeLeft && (
              <Box textStyle="h2">
                <Stack isInline spacing={0.5}>
                  <Text>Time remaining</Text>
                  <Text color="gray.500">
                    {humanizeDuration(timeLeft * 1000)}
                    {""}
                  </Text>
                  <Text></Text>
                </Stack>
              </Box>
            )}
          </Stack>
          <Stack>
            <Flex></Flex>
            <Box py={3}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStake()}
                disabled={disableStakeBtn}
              >
                stake eth
              </Button>
            </Box>
            {userStakedBalance && (
              <Box textStyle="h2">
                <Stack isInline spacing={0.5}>
                  <Text>Your staked balance:</Text>
                  <Text color="gray.500">
                    {formatBalance(userStakedBalance.toString())}
                    {""}
                  </Text>
                  <Text>eth</Text>
                </Stack>
              </Box>
            )}
          </Stack>
          <Stack spacing={1}>
            <Box py={5}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWithdraw()}
                disabled={disableWithdrawBtn}
              >
                withdraw
              </Button>
            </Box>
            {stakingBalance && (
              <Box textStyle="h2">
                <Stack isInline spacing={0.5} align="baseline" spacing={1}>
                  <Text>ETH2 staking contract holds:</Text>
                  <Text color="gray.500">
                    {ethers.utils.formatEther(stakingBalance)}
                    {""}
                  </Text>
                  <Text>eth</Text>
                </Stack>
              </Box>
            )}

            <Box py={5}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecute()}
                disabled={disableExecuteBtn}
              >
                execute
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
      <Box w="720px" ml="10px" textStyle="h1" px={50}>
        <Stack justify="space-between" py={150}>
          <Text></Text>
        </Stack>
        <Box>
          {gasPrice && (
            <Box textStyle="h2">
              <Stack isInline spacing={0.5} align="baseline" spacing={1}>
                <Text>Current gas price:</Text>
                <Text color="gray.500">
                  {gasPrice.toNumber()}
                  {""}
                </Text>
                <Text>gwei</Text>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Balance;
