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

const renderEmpty = () => {
  console.log("empty");

  for (let i = 0; i < 3; i++) {
    return (
      <>
        <Tr>
          <Td></Td>
          <Td></Td>
          <Td></Td>
        </Tr>
        <Tr>
          <Td></Td>
          <Td></Td>
          <Td></Td>
        </Tr>
        <Tr>
          <Td></Td>
          <Td></Td>
          <Td></Td>
        </Tr>
      </>
    );
  }
};

export default function History() {
  const { notifications } = useNotifications();
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [rowNum, setRowNum] = useState("3");

  useEffect(() => {
    // setNotificationHistory(notifications);
    notifications.map((notification) => {
      if (notification.type === "transactionSucceed") {
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
        console.log(
          "notificationHistory",
          parseInt(notification.receipt.logs[0].data.toString(), 16),
          "length",
          notificationHistory.length
        );
      }
    });
  }, [notifications]);

  const renderRow = () => {
    console.log("render", notificationHistory);
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
                {transaction.transaction.to.substring(36)}
              </Td>
            )}
            {transaction.transaction ? (
              <Td color="gray.500">
                {parseInt(transaction.receipt.logs[0].data.toString(), 16)}
              </Td>
            ) : (
              <Td>d</Td>
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
