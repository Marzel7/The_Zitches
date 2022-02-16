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

export default function History(props) {
  const { transactions } = useTransactions();

  const [rowNum, setRowNum] = useState("3");

  useEffect(() => {}, [props]);

  const renderRow = () => {
    return transactions.map((transaction, index) => {
      console.log("date", formatDate(transaction.submittedAt));
      if (index <= rowNum) {
        return (
          <Tr key={index} textStyle="h5">
            {transaction.submittedAt && (
              <Td>{formatDate(transaction.submittedAt)}</Td>
            )}

            {transaction.transaction.to && (
              <Td>
                ..
                {transaction.transaction.to.substring(36)}
              </Td>
            )}
            {transaction.transaction.value && (
              <Td color="gray.500">
                {formatBalance(transaction.transaction.value)}
              </Td>
            )}
          </Tr>
        );
      }
    });
  };

  return (
    <Box w="600px" ml="300px">
      <Stack p={2}>
        <Text textStyle="h3"></Text>
      </Stack>
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            {/* <Th>From</Th> */}
            <Th>To</Th>
            <Th>TKN</Th>
          </Tr>
        </Thead>
        <Tbody>{renderRow()}</Tbody>
        <Tfoot></Tfoot>
      </Table>
    </Box>
  );
}
