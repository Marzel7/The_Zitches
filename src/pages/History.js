import React, { useEffect, useState } from "react";
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

  const renderRow = () => {
    return transactions.map((transaction) => {
      return (
        <Tr color="gray.600">
          {transaction.receipt && (
            <Td fontSize={12} color="gray.600" key={transaction.submittedAt}>
              {formatDate(transaction.submittedAt)}
            </Td>
          )}
          {transaction.receipt && (
            <Td fontSize={12} key={transaction.submittedAt + 1}>
              ..
              {transaction.receipt.from.substring(36)}
            </Td>
          )}
          {transaction.receipt && (
            <Td fontSize={12} key={transaction.submittedAt + 2}>
              ..
              {transaction.receipt.to.substring(36)}
            </Td>
          )}
          {transaction.receipt && (
            <Td
              fontSize={12}
              fontWeight="bold"
              color="gray.500"
              key={transaction.submittedAt + 4}
            >
              {formatBalance(transaction.transaction.value)}
            </Td>
          )}
        </Tr>
      );
    });
  };

  return (
    <Box w="600px" ml="350px" textStyle="h1">
      <Stack>
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
