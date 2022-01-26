import { Box, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useCoingeckoPrice, useCoingeckoTokenPrice } from "@usedapp/coingecko";

export default function Prices() {
  const etherPrice = useCoingeckoPrice("ethereum", "usd");
  const WETH_CONTRACT = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const wethPrice = useCoingeckoTokenPrice(WETH_CONTRACT, "usd");
  return (
    <Box w="720px" ml="350px" textStyle="h1">
      <Stack p={2}>
        <Text>Prices</Text>
      </Stack>
      <Stack spacing={1}>
        <Box textStyle="h2">
          <Stack isInline spacing={0.5}>
            <Text>Ethereum price: $</Text>
            <Text color="gray.500">
              {etherPrice}
              {""}
            </Text>
          </Stack>
        </Box>
        <Box textStyle="h2">
          <Stack isInline spacing={0.5}>
            <Text>WETH price: $</Text>
            <Text color="gray.500">
              {wethPrice}
              {""}
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
