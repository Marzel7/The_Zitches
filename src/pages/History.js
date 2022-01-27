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
        <Tr textStyle="h2" key={transaction.submittedAt}>
          {transaction.receipt && (
            <Td>{formatDate(transaction.submittedAt)}</Td>
          )}
          {transaction.receipt && (
            <Td>
              ..
              {transaction.receipt.from.substring(36)}
            </Td>
          )}
          {transaction.receipt && (
            <Td>
              ..
              {transaction.receipt.to.substring(36)}
            </Td>
          )}
          {transaction.receipt && (
            <Td color="gray.500">
              {formatBalance(transaction.transaction.value)}
            </Td>
          )}
        </Tr>
      );
    });
  };

  return (
    <Box w="600px" ml="350px">
      <Stack p={2}>
        <Text textStyle="h1">Transactions</Text>
      </Stack>
      <Table>
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
