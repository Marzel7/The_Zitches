import React, { useState, useEffect } from "react";
import {
  useEtherBalance,
  useContractFunction,
  useContractCall,
  useEthers,
} from "@usedapp/core";
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

// import ABI
import StakerContract from "../contracts/abis/Staker.json";

// import contract address
import adrs from "../contracts/contract-address.json";

//const STAKING_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const Balance = () => {
  const { account, chainId } = useEthers();
  const userBalance = useEtherBalance(account);
  const stakingBalance = useEtherBalance(adrs.stakerAddr);

  let staker, stakerCall, networkId;
  try {
    chainId === 1337 ? (networkId = chainId) : (networkId = chainId);
    console.log("chainID", chainId);
    // contracts will be passed into useContractFunction
    staker = new Contract(adrs.stakerAddr, StakerContract.abi);

    // pass into useContractCall
    stakerCall = {
      abi: new ethers.utils.Interface(StakerContract.abi),
      address: adrs.stakerAddr,
      method: "timeLeft",
      args: [],
    };
  } catch (err) {
    console.log(err);
  }

  const timeLeft = useContractCall(stakerCall);
  const { send } = useContractFunction(staker, "stake", {});

  const handleClick = () => {
    const options = { value: ethers.utils.parseEther("1") };
    send(options);
    console.log("StakerContract.address", adrs.stakerAddr);
    console.log("timeleft", timeLeft);
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
    </>
  );
};

export default Balance;
