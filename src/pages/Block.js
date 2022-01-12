import React from 'react'
import { HStack, Flex, Box } from '@chakra-ui/layout'
import { useColorMode } from '@chakra-ui/color-mode';
import { getOverlayDirection } from 'react-bootstrap/esm/helpers';

export default function Block() {
    const { colorMode } = useColorMode()
    return (
        <Box w='200'
             h='15vh'
             bg={colorMode === 'light' ? 'gray.500' : 'gray.200'}
             boxShadow='lg'>
        </Box>
    )
}
