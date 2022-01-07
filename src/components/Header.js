import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { HStack, Flex, Box, Text } from '@chakra-ui/layout'
import { useMediaQuery } from '@chakra-ui/media-query'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Prices from './Prices';
import Accounts from './Accounts'
import Block from './Block';

export default function Header() {

return (
    <Router>
        <nav>
            <HStack spacing='24px'>
                <Link to="/account">Account</Link>
                <Link to="/balance">Balance</Link>
                <Link to="/block">Block</Link>
            </HStack>
        </nav>
    </Router>
    )
}

