import { VStack } from '@chakra-ui/layout';
import { ChakraProvider } from '@chakra-ui/react';
import Header from './components/Header'
import theme from './theme'

// Import ABI
import SimpleStorageContract from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json'
import SimpleStorage from './contracts/contract-address.json'


function App() {

	return (
    <ChakraProvider them={theme}>
		<VStack p={5}>
      <Header ml='8' size='md' fontWeight='semibold' color='cyan.400'>imthepk</Header>
    </VStack>
    </ChakraProvider>
	);
}

export default App