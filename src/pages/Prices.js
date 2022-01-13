import { Box, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { useCoingeckoPrice, useCoingeckoTokenPrice } from '@usedapp/coingecko'


export default function Prices() {
    const etherPrice = useCoingeckoPrice('ethereum', 'usd')
    const WETH_CONTRACT = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    const wethPrice = useCoingeckoTokenPrice(WETH_CONTRACT, 'usd')
    return (
        <Box w='720px'
            ml='350px'>
            <Stack  p={2.5}
                    align='baseline'
                    fontSize={22}
                    fontWeight='semibold'>
                <Text>Prices</Text>
            </Stack>
            <Stack spacing={2}>
            <Box >
                <Stack isInline fontWeight='semibold' fontSize={13} spacing={0.5} color='gray.600'>
                    <Text color='gray.600'>Ethereum price: $</Text>
                    <Text color='gray.500'>{etherPrice}{''}</Text>
                </Stack>
            </Box>
            <Box >
                <Stack isInline fontWeight='semibold' fontSize={13} spacing={0.5} color='gray.600'>
                    <Text color='gray.600'>WETH price: $</Text>
                    <Text color='gray.500'>{wethPrice}{''}</Text>
                </Stack>
            </Box>
            </Stack>
        </Box>
    )
}
