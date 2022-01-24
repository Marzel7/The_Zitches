import React from "react";
import { Box, Stack, Text } from "@chakra-ui/layout";
import {
  useBlock,
  useBlockMeta,
  useBlockNumber,
  useEthers,
  useGasPrice,
} from "@usedapp/core";

export default function Block() {
  const blockNumber = useBlockNumber();
  const { chainId } = useEthers();
  const { timestamp, difficulty } = useBlockMeta();

  return (
    <Box w="720px" ml="350px" textStyle="h1">
      <Stack align="baseline" fontSize={22} fontWeight="semibold">
        <Text>Block</Text>
      </Stack>
      <Stack>
        <Box textStyle="h2">
          <Stack isInline>
            <Text>Chain id:</Text>
            <Text color="gray.500">{chainId}</Text>
          </Stack>
        </Box>
        <Box textStyle="h2">
          <Stack isInline>
            <Text>Current block:</Text>
            <Text color="gray.500">{blockNumber}</Text>
          </Stack>
        </Box>
        {difficulty && (
          <Box textStyle="h2">
            <Stack isInline>
              <Text>Current difficulty:</Text>
              <Text color="gray.500">
                {difficulty.toString()}
                {""}
              </Text>
            </Stack>
          </Box>
        )}
        {timestamp && (
          <Box textStyle="h2">
            <Stack isInline>
              <Text>Current block timestamp:</Text>
              <Text color="gray.500">
                {timestamp.toString()}
                {""}
              </Text>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
