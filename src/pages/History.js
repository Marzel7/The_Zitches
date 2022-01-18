import React, { useEffect } from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useTransactions } from "@usedapp/core";
import { formatDate, formatBalance } from "../helpers";

export default function History() {
  const { transactions } = useTransactions();

  useEffect(() => {
    console.log("transactions", transactions);
  }, [transactions]);

  const renderRow = () => {
    return transactions.map((transaction) => {
      return (
        <Tr color="gray.600">
          <Td fontSize={12} color="gray.600" key={transaction.submittedAt + 1}>
            {formatDate(transaction.submittedAt)}
          </Td>
          <Td fontSize={12} key={transaction.submittedAt}>
            ..
            {transaction.receipt.from.substring(36)}
          </Td>
          <Td fontSize={12} key={transaction.submittedAt + 2}>
            ..
            {transaction.receipt.to.substring(36)}
          </Td>
          <Td
            fontSize={12}
            fontWeight="bold"
            color="gray.500"
            key={transaction.submittedAt + 3}
          >
            {formatBalance(transaction.transaction.value.hex)}
          </Td>
        </Tr>
      );
    });
  };

  return (
    <Box w="600px" ml="350px">
      <Stack
        justify="space-between"
        p={2.5}
        align="baseline"
        fontWeight="semibold"
      >
        <Text fontSize={22}>Transactions</Text>
      </Stack>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>From</Th>
            <Th>To</Th>
            <Th>Eth</Th>
          </Tr>
        </Thead>
        <Tbody>{renderRow()}</Tbody>
        <Tfoot></Tfoot>
      </Table>
    </Box>
  );
}
