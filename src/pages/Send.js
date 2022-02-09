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
import History from "./History";

// import contract address
import adrs from "../contracts/contract-address.json";
import { useCoingeckoPrice } from "@usedapp/coingecko";
import { utils } from "ethers";
import { formatBalance } from "../helpers.js";

export default function Send() {
  const etherPrice = useCoingeckoPrice("ethereum", "usd");

  const { account } = useEthers();
  const balance = useEtherBalance(account);

  const [amount, setAmount] = useState("0");
  const [disabled, setDisabled] = useState(false);
  const [ethValue, setEthValue] = useState("");

  const { sendTransaction, state } = useSendTransaction({
    transactionName: "Send Ethereum",
  });

  const handleClick = () => {
    setDisabled(true);
    sendTransaction({
      to: adrs.tokenAddr,
      value: utils.parseEther(amount),
    });
  };

  useEffect(() => {
    if (state.status != "Mining") {
      setDisabled(false);
      setAmount("");
      //setAddress("");
    }
  }, [state]);

  const handle = (amount) => {
    setAmount(amount);
    setEthValue("$" + amount * (etherPrice / 100));
    console.log("setEthValue");
  };

  return (
    <React.Fragment>
      <Stack>
        <Box w="600px" ml="350px">
          <Stack p={2}>
            <Text textStyle="h1">Tokens</Text>
          </Stack>
          <Box textStyle="h4">
            <Stack spacing={400} isInline>
              <Text></Text>
              <Stack isInline spacing={1}>
                <Text>Ether balance</Text>

                {balance && (
                  <Text textStyle="h5">{formatBalance(balance)}</Text>
                )}
                <Text>eth</Text>
              </Stack>
            </Stack>
          </Box>
          <Box width={600} p={1} textStyle="h5">
            <InputGroup size="md">
              <Input
                value={amount}
                onChange={(e) => handle(e.currentTarget.value)}
                disabled={disabled}
                fontSize={13}
                focusBorderColor="blue"
                width={75}
                pr="0.5rem"
                type={"text"}
                placeholder="tokens:"
                variant="unstyled"
              />

              <Input
                value={ethValue}
                //onChange={(e) => setAddress(e.currentTarget.value)}
                fontSize={13}
                focusBorderColor="blue"
                pr="0.5rem"
                placeholder="usd"
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
        </Box>
      </Stack>
      <Stack py={18}>
        <History></History>
      </Stack>
    </React.Fragment>
  );
}
