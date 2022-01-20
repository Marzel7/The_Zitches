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
import { useNotifications, useTransactions } from "@usedapp/core";
import { formatDate, formatBalance } from "../helpers";

export default function History() {
  const { transactions } = useTransactions();

  const renderRow = () => {
    return transactions.map((transfer, index) => {
      console.log(transfer);
      return (
        <Tr color="gray.600">
          {transfer.receipt && (
            <Td fontSize={12} color="gray.600" key={transfer.submittedAt}>
              {formatDate(transfer.submittedAt)}
            </Td>
          )}
          {transfer.receipt && (
            <Td fontSize={12} key={transfer.submittedAt + 1}>
              ..
              {transfer.receipt.from.substring(36)}
            </Td>
          )}
          {transfer.receipt && (
            <Td fontSize={12} key={transfer.submittedAt + 2}>
              ..
              {transfer.receipt.to.substring(36)}
            </Td>
          )}
          {transfer.receipt && (
            <Td
              fontSize={12}
              fontWeight="bold"
              color="gray.500"
              key={transfer.submittedAt + 4}
            >
              {formatBalance(transfer.transaction.value)}
            </Td>
          )}
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
