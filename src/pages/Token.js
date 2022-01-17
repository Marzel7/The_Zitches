import React from "react";
import { Box, Text, Stack } from "@chakra-ui/react";

export default function Token() {
  return (
    <Box w="720px" ml="350px">
      <Stack
        justify="space-between"
        p={2.5}
        align="baseline"
        fontWeight="semibold"
      >
        <Text fontSize={22}>Tokens</Text>
      </Stack>
    </Box>
  );
}
