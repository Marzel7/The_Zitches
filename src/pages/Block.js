import React from 'react'
import { Box, Stack, Text } from '@chakra-ui/layout'
import { useBlockMeta, useBlockNumber, useEthers } from '@usedapp/core'


export default function Block() {

    const currentBlock = useBlockNumber()
    const chainId = useEthers().chainId
    const { timestamp, difficulty } = useBlockMeta()
    console.log(timestamp, difficulty)

    return (
        <Box
            w='720px'
            ml='350px'>
            <Stack
                p={2.5}
                align='baseline'
                fontSize={22}
                fontWeight='semibold'>
                <Text>Block</Text>
            </Stack>
            <Stack spacing={2}>
                <Box>
                    <Stack isInline fontWeight='semibold' fontSize={13} spacing={0.5} color='gray.600'>
                        <Text>Chain id:</Text>
                        <Text color='gray.500'>{chainId}</Text>
                    </Stack>
                </Box>
                <Box>
                    <Stack isInline fontWeight='semibold' fontSize={13} spacing={0.5} color='gray.600'>
                        <Text>Current block:</Text>
                        <Text color='gray.500'>{currentBlock}</Text>
                    </Stack>
                </Box>
                <Box>
                    <Stack isInline fontWeight='semibold' fontSize={13} spacing={0.5} color='gray.600'>
                        <Text>Current difficulty:</Text>
                        <Text color='gray.500'>{difficulty.toString()}</Text>
                    </Stack>
                </Box>
                <Box>
                    <Stack isInline fontWeight='semibold' fontSize={13} spacing={0.5} color='gray.600'>
                        <Text>Current block timestamp:</Text>
                        <Text color='gray.500'>{timestamp.toLocaleString()}</Text>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}
