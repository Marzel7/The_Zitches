import React, { useState, useEffect } from "react";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
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
import Withdraw from "../components/subcomponents/Withdraw";
import TransactionType from "../components/subcomponents/TransactionType";

// import contract address
import adrs from "../contracts/contract-address.json";
// import ABI
import TokenContract from "../contracts/abis/Token.json";
import VendorContract from "../contracts/abis/Vendor.json";

import { useCoingeckoPrice } from "@usedapp/coingecko";
import { formatBalance, formatUSD } from "../helpers.js";

import {
  useTokenBalanceCall,
  useContractMethod,
  useTokenContractMethod,
  useTokenAllowanceCall,
} from "../hooks";

const { ethers } = require("ethers");

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

  const tokensPerEth = 1;
  // Hooks
  const balance = useEtherBalance(account);
  const vendorEthBalance = useEtherBalance(vendor.address);

  // Vendor hooks
  const vendorTokenBalance = useTokenBalanceCall(adrs.vendorAddr);
  const accountTokenBalance = useTokenBalanceCall(account);
  let allowance = useTokenAllowanceCall(account, vendor.address);

  console.log("allowance", allowance);

  const [amount, setAmount] = useState("0");
  const [disabled, setDisabled] = useState(false);
  const [ethValue, setEthValue] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const [tokenBuyAmount, setTokenBuyAmount] = useState({
    valid: true,
    value: "",
  });

  const [tokenSellAmount, setTokenSellAmount] = useState({
    valid: true,
    value: "",
  });

  const ethCostToPurchaseTokens =
    tokenBuyAmount.valid &&
    tokensPerEth &&
    ethers.utils.parseEther(
      "" + tokenBuyAmount.value / parseFloat(tokensPerEth)
    );

  const ethValueToSellTokens =
    tokenSellAmount.valid &&
    tokensPerEth &&
    ethers.utils.parseEther(
      "" + tokenSellAmount.value * parseFloat(tokensPerEth)
    );

  const { state: setBuyState, send: buyTokens } =
    useContractMethod("buyTokens");
  const { state: setSellState, send: sellTokens } =
    useContractMethod("sellTokens");
  const { state: setApproveState, send: approveTokens } =
    useTokenContractMethod("approve");

  const handleBuyTokens = (amount) => {
    setDisabled(true);
    if (transactionType === "Buy") {
      buyTokens({ value: amount });
    } else {
      allowance >= amount
        ? sellTokens(amount)
        : approveTokens(vendor.address, amount);
    }
  };

  useEffect(() => {
    if (
      (setBuyState.status || setSellState.status || setApproveState.status) !=
      "Mining"
    ) {
      setDisabled(false);
      setAmount("");
      setEthValue("");
    }
  }, [setBuyState, setSellState, setApproveState]);

  useEffect(() => {
    setAmount("");
    setEthValue("");
  }, [transactionType]);

  const handleTokenAmount = (e) => {
    const re = /^\d+(\.\d{0,2})?$/;

    let value = e.target.value;
    // if value is not blank, then test the regex

    if (e.target.value === "" || re.test(e.target.value)) {
      if (
        Number(e.target.value) <= formatEther(vendorTokenBalance.toString()) &&
        transactionType === "Buy"
      ) {
        setAmount(e.target.value);
        setEthValue("$" + formatUSD(e.target.value * etherPrice));
      }
      if (
        Number(e.target.value) <= formatEther(accountTokenBalance.toString()) &&
        transactionType === "Sell"
      ) {
        setAmount(e.target.value);
        setEthValue("$" + formatUSD(e.target.value * etherPrice));
      }

      const newValue = e.target.value.startsWith(".") ? "0." : e.target.value;
      const buyAmount = {
        value: newValue,
        valid: /^\d*\.?\d+$/.test(newValue),
      };

      transactionType == "Buy"
        ? setTokenBuyAmount(buyAmount)
        : setTokenSellAmount(buyAmount);
    }
  };

  const purchaseType = (childData) => {
    setTransactionType(childData);
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
                  <Text textStyle="h5">
                    {formatBalance(accountTokenBalance.toString())}
                  </Text>
                )}
              </Stack>
              <Stack isInline spacing={1}>
                <Text>Ether balance</Text>

                {balance && (
                  <Text textStyle="h5">
                    {formatBalance(balance.toString())}
                  </Text>
                )}
                <Text>eth</Text>
                <Spacer></Spacer>
                <Text>Vendor TKN balance</Text>

                {vendorTokenBalance && (
                  <Text textStyle="h5">
                    {formatBalance(vendorTokenBalance.toString())}
                  </Text>
                )}
                <Text></Text>
              </Stack>
            </Stack>
          </Box>
          <Stack py={7} px={250}>
            <Box width={280} px={1} textStyle="h5">
              <TransactionType purchaseType={purchaseType}></TransactionType>
              <InputGroup ml="65" mt="5">
                <Input
                  value={amount}
                  onChange={(e) => handleTokenAmount(e)}
                  disabled={disabled}
                  fontSize={14}
                  focusBorderColor="blue"
                  width={75}
                  pr="0.5rem"
                  type={"text"}
                  placeholder="TKN"
                  variant="unstyled"
                  text-align="right"
                />

                <Input
                  value={ethValue}
                  fontSize={14}
                  width={300}
                  focusBorderColor="blue"
                  pr="0.5rem"
                  placeholder="usd"
                  variant="outline"
                />
                <InputRightElement width="6.0 rem">
                  <Button
                    variant="outline"
                    focusBorderColor="blue"
                    disabled={disabled}
                    fontSize={11}
                    mr={2}
                    size="sm"
                    onClick={(e) =>
                      handleBuyTokens(
                        transactionType == "Buy"
                          ? ethCostToPurchaseTokens
                          : ethValueToSellTokens
                      )
                    }
                  >
                    Confirm {transactionType}
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
      <Withdraw></Withdraw>
    </>
  );
};
export default Send;
