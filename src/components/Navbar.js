import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import MenuItems from './subcomponents/navbar/MenuItems';
import { useEthers } from "@usedapp/core";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useNavigate, useParams, useLocation, useMatch } from "react-router";
import Block from './Block';
import Header from './Header';


export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { account } = useEthers()
  return (

      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box>FX Finance</Box>
          <Header/>
            <Flex alignItems={'center'}>
                <Stack direction={'row'} spacing={7}>
                  <Button onClick={toggleColorMode}>
                      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  </Button>
                    <MenuItems>
                    </MenuItems>
                </Stack>
            </Flex>
        </Flex>
      </Box>
      

  );
}