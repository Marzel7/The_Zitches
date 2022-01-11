import React from 'react'
import { HStack, VStack, Button} from '@chakra-ui/react'
import { useMediaQuery } from '@chakra-ui/media-query';
import { Box, Flex, Stack, Text, Spacer, Heading } from '@chakra-ui/layout'


export default function Balance() {

    const [isNotSmallerScreen ] = useMediaQuery("(min-width:600px)")
    return (
        <React.Fragment>
        <Flex  p='4' ml="250" mr="250">
            <Heading mt='15px'size='md'>Balance</Heading>
        <Spacer />
            <Box >
                <Button size='md' colorScheme='teal' mr='4'>
                Connect
                </Button>
            </Box>
        </Flex>
        <Flex>
            <Stack align='center'>
                <Box as='button' borderRadius='md' bg='white' color='black' width={'885px'} h={16} align='center' ml="265" >
                    Button
                </Box>
            </Stack>
        </Flex>
        </React.Fragment>
    )
}
