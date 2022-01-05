import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { HStack, Flex, Box, Text } from '@chakra-ui/layout'
import { useMediaQuery } from '@chakra-ui/media-query'

export default function Header() {

    const { colorMode } = useColorMode()
    const isDark = colorMode === "dark"

    const [isNotSmallerScreen] = useMediaQuery("(min-width:600px)")

    return (
        <HStack spacing='24px'>
            <Box w='40px' h='40px' bg='yellow.200'>
                1
            </Box>
            <Box w='40px' h='40px' bg='tomato'>
                2
            </Box>
            <Box w='40px' h='40px' bg='pink.100'>
                3
            </Box>
        </HStack>
    )
}
