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

import { useNotifications } from "@usedapp/core";
import { formatDate } from "../helpers";
import { formatBalance } from "../helpers.js";

export default function History() {
  const { notifications } = useNotifications();
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [rowNum, setRowNum] = useState("3");

  useEffect(() => {
    notifications.map((notification) => {
      console.log(notifications);
      if (
        notification.type === "transactionSucceed" &&
        (notification.transactionName == "buyTokens" ||
          notification.transactionName == "sellTokens" ||
          notification.transactionName == "approve")
      ) {
        {
          setNotificationHistory(() => [notification, ...notificationHistory]);
        }
        setNotificationHistory((notificationHistory) =>
          notificationHistory.filter(
            (v, i, a) =>
              a.findIndex((t) =>
                ["submittedAt"].every((k) => t[k] === v[k])
              ) === i
          )
        );
      }
    });
  }, [notifications]);

  const renderRow = () => {
    return notificationHistory.map((transaction, index) => {
      if (index <= rowNum) {
        return (
          <Tr key={index} textStyle="h5">
            {transaction.transaction && (
              <Td>{formatDate(transaction.submittedAt)}</Td>
            )}
            {transaction.transaction && (
              <Td>
                ..
                {transaction.transaction.from.substring(36)}
              </Td>
            )}
            {transaction.receipt.logs[0].data.toString() && (
              <Td color="gray.500">
                {formatBalance(transaction.receipt.logs[0].data.toString(), 16)}
              </Td>
            )}
            {transaction.transactionName != "approve" && (
              <Td>{transaction.transactionName === "buyTokens" ? "+" : "-"}</Td>
            )}
            {transaction.transactionName == "approve" && (
              <Td>{transaction.transactionName === "approve" ? "A" : "A"}</Td>
            )}
          </Tr>
        );
      }
    });
  };

  return (
    <Box w="600px" h="275" ml="300px">
      <Stack p={2}>
        <Text textStyle="h3"></Text>
      </Stack>
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>From</Th>

            <Th>TKN</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>{notificationHistory != null ? renderRow() : ""}</Tbody>
        <Tfoot></Tfoot>
      </Table>
    </Box>
  );
}
