import React, { useState, useEffect } from "react";
import { useEtherBalance, useContractFunction, useEthers } from "@usedapp/core";

import {
  Stack,
  Text,
  Box,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { formatBalance } from "../helpers.js";
import { Contract } from "@ethersproject/contracts";
import humanizeDuration from "humanize-duration";
import { useTimeLeft } from "../hooks";

// import ABI
import StakerContract from "../contracts/abis/Staker.json";

// import contract address
import adrs from "../contracts/contract-address.json";

const Balance = () => {
  let staker, networkId;
  const { account, chainId } = useEthers();
  const userBalance = useEtherBalance(account);
  const stakingBalance = useEtherBalance(adrs.stakerAddr);

  try {
    chainId === 1337 ? (networkId = chainId) : (networkId = chainId);

    // contracts will be passed into useContractFunction
    staker = new Contract(adrs.stakerAddr, StakerContract.abi);
  } catch (err) {
    console.log(err);
  }

  const timeLeft = useTimeLeft();
  const { send } = useContractFunction(staker, "stake", {});

  const handleClick = () => {
    const options = { value: ethers.utils.parseEther("1") };
    console.log(timeLeft);
    send(options);
  };

  return (
    <>
      <Box w="720px" ml="350px" textStyle="h1">
        <Stack justify="space-between" p={2}>
          <Text>Stake</Text>
        </Stack>
        <Box>
          <Stack>
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
                  <Text>Remaining</Text>
                  <Text color="gray.500">
                    {humanizeDuration(timeLeft * 1000)}
                  </Text>
                  <Text></Text>
                </Stack>
              </Box>
            )}
          </Stack>
          <Box p={2}>
            <InputGroup py={2} w={200}>
              <Input></Input>
              <InputRightElement>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClick()}
                >
                  Send
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </Box>
      </Box>
      <Box w="720px" ml="10px" textStyle="h1" px={50}>
        <Stack justify="space-between" p={50}>
          <Text>Gas</Text>
        </Stack>
      </Box>
    </>
  );
};

export default Balance;
