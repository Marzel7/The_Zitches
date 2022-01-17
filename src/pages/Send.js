import React, { useState, useEffect } from "react";
import { formatEther } from "@ethersproject/units";
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
import { utils, BigNumber } from "ethers";

const formatter = new Intl.NumberFormat("en-us", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const formatBalance = (balance) => {
  console.log(balance);
  return formatter.format(
    parseFloat(formatEther(balance ?? BigNumber.from("0")))
  );
};

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
      <Stack
        justify="space-between"
        p={2.5}
        align="baseline"
        fontWeight="semibold"
      >
        <Text fontSize={22}>Send</Text>
      </Stack>
      <Box>
        <Stack
          spacing={300}
          isInline
          color="gray.600"
          fontSize={13}
          fontWeight="semibold"
        >
          <Text>Send transaction</Text>
          <Stack isInline fontWeight="semibold" spacing={1}>
            <Text justify-content="right">Ether balance</Text>

            {balance && <Text color="gray.500">{formatBalance(balance)}</Text>}
            <Text justify-content="right">eth</Text>
          </Stack>
        </Stack>
      </Box>
      <Box width={600} p={1}>
        <InputGroup size="md">
          <Input
            // id={`EthInput`}
            // type="number"
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
            // id={`AddressInput`}
            // type="text"
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
              h="1.75rem"
              w="5rem"
              size="sm"
              box-shadow=" 10 10 0 1px"
              _focus="none"
              variant="outline"
              _hover={{
                boxShadow: "sm",
                background: "gray.900",
                color: "gray.100",
              }}
              _active="red.300"
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
