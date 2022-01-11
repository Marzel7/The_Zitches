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
import { Link } from "react-router-dom";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (

      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={8}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'} >
          <Box>FX Finance</Box>
            <HStack spacing='60px'>
                <Link to="/account">Balance</Link>
                <Link to="/price">Prices</Link>
                <Link to="/block">Block</Link>
                <Link to="/block">Block</Link>
                <Link to="/block">Token</Link>
                <Link to="/block">Send Ether</Link>
                <Link to="/block">Transactions</Link>
          </HStack>
          <Flex alignItems={'center'}>
                <Stack direction={'row'} spacing={7}>
                  <Button onClick={toggleColorMode}>
                      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  </Button>
                  <MenuItems/>
                </Stack>
          </Flex>
        </Flex>
      </Box>


  );
}