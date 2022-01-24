import { useState } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Button, Spinner } from "react-bootstrap";
import { ethers } from "ethers";
import { formatEther, formatUnits } from "@ethersproject/units";
import { Contract } from "@ethersproject/contracts";
import {
  useEthers,
  useTokenBalance,
  useEtherBalance,
  useContractCall,
  useContractFunction,
  useNotifications,
} from "@usedapp/core";

import { Route, Routes } from "react-router-dom";
import { useBlockMeta, useBlockNumber } from "@usedapp/core";

// Import ABI
import SimpleStorage from "./contracts/abis/SimpleStorage.json";
import SimpleStorageAddr from "./contracts/contract-address.json";

// Import CSS
import "./App.css";

// Import Components
import Navbar from "./pages/Navbar";
import Block from "./pages/Block";
import Prices from "./pages/Prices";
import Balance from "./pages/Balance";
import Send from "./pages/Send";
import History from "./pages/History";
import { Theme } from "./styles/theme";

function App() {
  return (
    <ChakraProvider theme={Theme}>
      <Navbar />
      <Routes>
        <Route path="/account" element={<Balance />}></Route>
        <Route path="/price" element={<Prices />}></Route>
        <Route path="/block" element={<Block />}></Route>
        <Route path="/send" element={<Send />}></Route>
        <Route path="/transactions" element={<History />}></Route>
        <Route path="/" element={<Balance />}></Route>
      </Routes>
    </ChakraProvider>
  );
}

export default App;
