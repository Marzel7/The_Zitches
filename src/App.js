import { useState } from 'react'
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { Button, Spinner } from 'react-bootstrap';
import { ethers } from "ethers";
import { formatEther, formatUnits } from '@ethersproject/units'
import { Contract } from '@ethersproject/contracts';
import {
	useEthers, useTokenBalance, useEtherBalance, useContractCall, useContractFunction, useNotifications
} from '@usedapp/core'
import Layout from './components/Layout'

// Import ABI
import SimpleStorage from './contracts/abis/SimpleStorage.json'
import SimpleStorageAddr from './contracts/contract-address.json'

// Import CSS
import './App.css'

// Import Components
import Navbar from './components/Navbar';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
	return (
    <ChakraProvider>
      <Navbar isOpen={isOpen} onClose={onClose}/>
    </ChakraProvider>
	);
}


export default App
