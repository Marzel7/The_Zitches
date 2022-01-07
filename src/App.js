import { useState } from 'react'
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { Button, Spinner } from 'react-bootstrap';
import { ethers } from "ethers";
import { formatEther, formatUnits } from '@ethersproject/units'
import { Contract } from '@ethersproject/contracts';
import {
	useEthers, useTokenBalance, useEtherBalance, useContractCall, useContractFunction, useNotifications
} from '@usedapp/core'

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";


// Import ABI
import SimpleStorage from './contracts/abis/SimpleStorage.json'
import SimpleStorageAddr from './contracts/contract-address.json'

// Import CSS
import './App.css'

// Import Components
import Navbar from './components/Navbar';
import Block from './components/Block';
import Prices from './components/Prices'
import Accounts from './components/Accounts';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
	return (
    <ChakraProvider>
      <Navbar isOpen={isOpen} onClose={onClose}/>
      <Router>
      <main>
        <Routes>
          <Route path="/block" element={<Block/>}/>
          <Route path="/prices" element={<Prices/>}/>
          <Route path="/accounts" element={<Accounts/>}/>
        </Routes>
      </main>
    </Router>
    </ChakraProvider>
	);
}



export default App
