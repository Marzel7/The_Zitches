import React, { useState, useEffect } from "react";
import { useEtherBalance, useEthers, useContractFunction } from "@usedapp/core";

import { Contract } from "@ethersproject/contracts";
import {
  Stack,
  Text,
  Box,
  Button,
  InputGroup,
  Input,
  InputRightElement,
  Spacer,
} from "@chakra-ui/react";
import History from "./History";
import Search from "../components/subcomponents/Search";

// import contract address
import adrs from "../contracts/contract-address.json";
// import ABI
import TokenContract from "../contracts/abis/Token.json";
import VendorContract from "../contracts/abis/Vendor.json";

import { useCoingeckoPrice } from "@usedapp/coingecko";
import { formatBalance } from "../helpers.js";

import { useTokenBalanceCall } from "../hooks";
import search from "../components/subcomponents/Search";

const Send = () => {
  let token, vendor, networkId;
  const etherPrice = useCoingeckoPrice("ethereum", "usd");

  const { account, chainId } = useEthers();

  try {
    chainId === 1337 ? (networkId = chainId) : (networkId = chainId);
    token = new Contract(adrs.tokenAddr, TokenContract.abi);
    vendor = new Contract(adrs.vendorAddr, VendorContract.abi);
  } catch (e) {
    console.log("error reading contracts", e);
  }
  // Hooks
  const balance = useEtherBalance(account);

  // Vendor hooks
  const vendorTokenBalance = useTokenBalanceCall(adrs.vendorAddr);
  const accountTokenBalance = useTokenBalanceCall(account);

  const [amount, setAmount] = useState("0");
  const [disabled, setDisabled] = useState(false);
  const [ethValue, setEthValue] = useState("");

  const { send, state } = useContractFunction(vendor, "buyTokens", {});

  const handleBuyTokens = () => {
    setDisabled(true);
    send(account, amount);
  };

  useEffect(() => {
    if (state.status != "Mining") {
      setDisabled(false);
      setAmount("");
      setEthValue("");
    }
  }, [state]);

  const handle = (amount) => {
    setAmount(amount);
    setEthValue("$" + amount * etherPrice);
  };

  return (
    <>
      <Stack>
        <Box w="600px" ml="300px">
          <Stack>
            <Text textStyle="h1"></Text>
          </Stack>
          <Box textStyle="h4">
            <Stack>
              <Stack isInline spacing={1}>
                <Text>TKN Balance</Text>
                {accountTokenBalance && (
                  <Text textStyle="h5">{accountTokenBalance.toString()}</Text>
                )}
              </Stack>
              <Stack isInline spacing={1}>
                <Text>Ether balance</Text>

                {balance && (
                  <Text textStyle="h5">{formatBalance(balance)}</Text>
                )}
                <Text>eth</Text>
                <Spacer></Spacer>
                <Text>Vendor TKN balance</Text>

                {vendorTokenBalance && (
                  <Text textStyle="h5">{vendorTokenBalance.toString()}</Text>
                )}
                <Text></Text>
              </Stack>
            </Stack>
          </Box>
          <Stack py={7} px={300}>
            <Box width={250} px={1} textStyle="h5">
              <InputGroup size="md">
                <Input
                  value={amount}
                  onChange={(e) => handle(e.currentTarget.value)}
                  disabled={disabled}
                  fontSize={13}
                  focusBorderColor="blue"
                  width={105}
                  pr="0.5rem"
                  type={"text"}
                  placeholder="buy tokens"
                  variant="unstyled"
                />

                <Input
                  value={ethValue}
                  onChange={(e) => setEthValue(e.currentTarget.value)}
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
                    onClick={(e) => handleBuyTokens(amount)}
                    variant="outline"
                  >
                    Confirm
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </Stack>
        </Box>

        <Stack>
          <History></History>
        </Stack>
      </Stack>
      <Search></Search>
    </>
  );
};
export default Send;
