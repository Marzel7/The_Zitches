import React from "react";
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
import { Contract } from "@ethersproject/contracts";
import { formatEther } from "@ethersproject/units";
// import contract address
import adrs from "../../contracts/contract-address.json";
// import ABI
import VendorContract from "../../contracts/abis/Vendor.json";

export default function Withdraw() {
  let vendor, networkId;

  const { account, chainId } = useEthers();

  try {
    chainId === 1337 ? (networkId = chainId) : (networkId = chainId);

    vendor = new Contract(adrs.vendorAddr, VendorContract.abi);
  } catch (e) {
    console.log("error reading contracts", e);
  }

  const { send, state } = useContractFunction(vendor, "withdraw", {});

  const contractEthBalance = useEtherBalance(vendor.address);
  const handleWithdrawBtn = () => {
    console.log(formatEther(contractEthBalance));
    send();
  };

  return (
    <Box w="600px" ml="300px">
      <Stack isInline spacing={1}>
        <Text textStyle="h4">Contract Balance</Text>
        {contractEthBalance && (
          <Text textStyle="h5">{formatEther(contractEthBalance)} eth</Text>
        )}
      </Stack>
      <Stack>
        <Box width={100} px={3} py={1} textStyle="h5">
          <InputGroup size="md">
            <InputRightElement width="6.5rem">
              <Button
                variant="outline"
                focusBorderColor="blue"
                size="sm"
                fontSize={11}
                onClick={(e) => handleWithdrawBtn()}
                variant="outline"
              >
                Withdraw
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Stack>
    </Box>
  );
}
