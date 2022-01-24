import React from "react";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { Stack, Text, Box } from "@chakra-ui/react";
import { ethers } from "ethers";
import { formatBalance } from "../helpers.js";

const STAKING_CONTRACT = "0x00000000219ab540356cBB839Cbe05303d7705Fa";

export default function Balance() {
  const { account } = useEthers();
  const userBalance = useEtherBalance(account);
  const stakingBalance = useEtherBalance(STAKING_CONTRACT);

  return (
    <>
      <Box w="720px" ml="350px" textStyle="h1">
        <Stack justify="space-between">
          <Text>Balance</Text>
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
        </Box>
      </Box>
    </>
  );
}
