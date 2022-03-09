import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Stack,
  Button,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import { useEtherBalance, useEthers, useContractFunction } from "@usedapp/core";
import { useTokenBalanceCall } from "../../hooks";
import { formatBalance } from "../../helpers.js";

// import contract address
import adrs from "../../contracts/contract-address.json";
// import ABI
import TokenContract from "../../contracts/abis/Token.json";

export default function Search() {
  const { account } = useEthers();
  const [ethAddress, setEthAddress] = useState("");
  const accountTokenBalance = useTokenBalanceCall(ethAddress);

  const handleEthAddress = (address) => {
    setEthAddress(address);
  };

  const handleSearchBtn = (address) => {
    setEthAddress("");
  };

  return (
    <>
      <Box w="600px" ml="300px" py={5}>
        <Stack isInline spacing={1}>
          <Text textStyle="h4">TKN Balance</Text>
          {accountTokenBalance && (
            <Text textStyle="h5">
              {formatBalance(accountTokenBalance.toString())}
            </Text>
          )}
        </Stack>
        <Stack>
          <Box width={420} px={1} py={1} textStyle="h5">
            <InputGroup size="md">
              <Input
                value={ethAddress}
                onChange={(e) => handleEthAddress(e.currentTarget.value)}
                fontSize={11}
                focusBorderColor="blue"
                type={"text"}
                spellCheck="false"
                pr="0.5rem"
                placeholder="0x.."
                variant="outline"
              />
              <InputRightElement width="6.5rem">
                <Button
                  variant="outline"
                  focusBorderColor="blue"
                  size="sm"
                  fontSize={12}
                  onClick={(e) => handleSearchBtn(ethAddress)}
                  variant="outline"
                >
                  Clear
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
