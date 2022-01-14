import React from 'react'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { Stack, Text, Box } from '@chakra-ui/react'
import { ethers } from "ethers";


export default function Send() {
    const { account } = useEthers()
    const balance = useEtherBalance(account)

    return (
        <Box w="600px"
             ml='350px'
            >
            <Stack
                justify='space-between'
                p={2.5}
                align='baseline'
                fontWeight='semibold'
            >
                <Text fontSize={22}>Send</Text>
            </Stack>
            <Box>
                <Stack spacing={210} isInline color='gray.600' fontSize={13} fontWeight='semibold'>
                    <Text>Send transaction</Text>
                    <Stack  isInline fontWeight='semibold' >
                        <Text justify-content='right'>Ether balance</Text>
                        <Text color='gray.500'>{formatEther(balance)}</Text>
                        <Text justify-content='right'>eth</Text>
                    </Stack>
                </Stack>
            </Box>
            <Box></Box>
        </Box>
    )
}

