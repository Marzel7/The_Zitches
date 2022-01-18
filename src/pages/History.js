import React, { useEffect } from "react";
import { Box, Text, Stack, Tag } from "@chakra-ui/react";
import { useTransactions } from "@usedapp/core";
import { formatBalance, formatDate } from "../helpers.js";

export default function History() {
  const { transactions } = useTransactions();

  useEffect(() => {
    console.log("transactions", transactions);
  }, [transactions]);

  return (
    <Box w="720px" ml="350px">
      <Stack
        justify="space-between"
        p={2.5}
        align="baseline"
        fontWeight="semibold"
      >
        <Text fontSize={22}>Transactions</Text>
      </Stack>
      <Box p={4}>
        {transactions.map((transaction) => {
          return (
            <Stack isInline spacing={5} fontSize={13}>
              <Text key={transaction.submittedAt}>
                {transaction.receipt.from.substring(36)}
              </Text>
              <Text key={transaction.submittedAt + 1}>
                {transaction.receipt.to.substring(36)}
              </Text>
              <Text key={transaction.submittedAt + 2}>
                {formatBalance(transaction.transaction.gasPrice.hex)}
              </Text>
              <Text key={transaction.submittedAt + 3}>
                {formatBalance(transaction.transaction.value.hex)}
              </Text>
              <Text key={transaction.submittedAt + 4}>
                {formatDate(transaction.submittedAt)}
              </Text>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}
