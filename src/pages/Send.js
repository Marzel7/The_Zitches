import React, { useState, useEffect } from "react";
import { useEtherBalance, useEthers, useSendTransaction } from "@usedapp/core";
import {
  Stack,
  Text,
  Box,
  Button,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import { utils } from "ethers";
import { formatBalance } from "../helpers.js";

export default function Send() {
  const { account } = useEthers();
  const balance = useEtherBalance(account);

  const [amount, setAmount] = useState("0");
  const [disabled, setDisabled] = useState(false);
  const [address, setAddress] = useState("");

  const { sendTransaction, state } = useSendTransaction({
    transactionName: "Send Ethereum",
  });

  const handleClick = () => {
    setDisabled(true);
    sendTransaction({
      to: address,
      value: utils.parseEther(amount),
    });
  };

  useEffect(() => {
    if (state.status != "Mining") {
      setDisabled(false);
      setAmount("");
      setAddress("");
    }
  }, [state]);

  return (
    <Box w="600px" ml="350px">
      <Stack p={2}>
        <Text textStyle="h1">Send</Text>
      </Stack>
      <Box textStyle="h4">
        <Stack spacing={300} isInline>
          <Text>Send transaction</Text>
          <Stack isInline spacing={1}>
            <Text>Ether balance</Text>

            {balance && <Text textStyle="h5">{formatBalance(balance)}</Text>}
            <Text>eth</Text>
          </Stack>
        </Stack>
      </Box>
      <Box width={600} p={1}>
        <InputGroup size="md">
          <Input
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
            disabled={disabled}
            fontSize={13}
            focusBorderColor="blue"
            width={150}
            pr="0.5rem"
            type={"text"}
            placeholder="eth:"
            variant="unstyled"
          />
          <Input
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
            fontSize={13}
            focusBorderColor="blue"
            pr="0.5rem"
            placeholder="address:"
            variant="outline"
          />
          <InputRightElement width="6.5rem">
            <Button
              variant="outline"
              focusBorderColor="blue"
              size="sm"
              onClick={() => handleClick()}
            >
              Send
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box></Box>
    </Box>
  );
}
