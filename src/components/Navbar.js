import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { HStack } from '@chakra-ui/layout'
import MenuItems from './subcomponents/navbar/MenuItems';
import { useEthers } from "@usedapp/core";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useNavigate, useParams, useLocation, useMatch } from "react-router";
import Prices from './Prices';
import Accounts from './Accounts'
import Block from './Block';



export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { account } = useEthers()
  return (

      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>FX Finance</Box>
            <HStack spacing='24px'>
                <Link to="/account">Account</Link>
                <Link to="/price">Price</Link>
                <Link to="/block">Block</Link>
          </HStack>
          <Flex alignItems={'center'}>
                <Stack direction={'row'} spacing={7}>
                  <Button onClick={toggleColorMode}>
                      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  </Button>
                </Stack>
          </Flex>
        </Flex>
      </Box>


  );
}