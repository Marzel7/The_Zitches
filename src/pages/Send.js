import React from 'react'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { Stack, Text, Box, Button, InputGroup, Input, InputRightElement } from '@chakra-ui/react'
import { ethers } from "ethers";


export default function Send() {
    const { account } = useEthers()
    const balance = useEtherBalance(account)
    const show = true

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

                        {balance && (
                        <Text color='gray.500'>{formatEther(balance)}</Text> )}
                        <Text justify-content='right'>eth</Text>
                    </Stack>
                </Stack>
            </Box>
            <Box width={600} p={1}>
            <InputGroup size='md'>
                <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='Eth to:'
                />
                <InputRightElement width='6.5rem'>
                    <Button h='1.75rem' w='5rem' size='sm'
                    px={4}
                    variant='outline'
                    _hover={{
                        boxShadow: 'sm',
                        background: "gray.900",
                        color: "gray.100",
                    }}
                    _active= "gray.900">
                     Send
                    </Button>
                </InputRightElement>
                </InputGroup>
            </Box>
            </Box>

    )
}

