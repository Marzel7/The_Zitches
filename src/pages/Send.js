import React from 'react'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { Stack, Text, Box, Button, InputGroup, Input, InputRightElement, InputLeftElement, useColorModeValue, Image } from '@chakra-ui/react'
import { ethers } from "ethers";


export default function Send() {
    const { account } = useEthers()
    const balance = useEtherBalance(account)
    const show = true

    const sendTransaction = async (amount) => {
        console.log('send')
    }

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
                <Stack spacing={340} isInline color='gray.600' fontSize={13} fontWeight='semibold'>
                    <Text>Send transaction</Text>
                    <Stack isInline fontWeight='semibold' spacing={1}>
                        <Text justify-content='right'>Ether balance</Text>

                        {balance && (
                        <Text color='gray.500'>{formatEther(balance)}</Text> )}
                        <Text justify-content='right'>eth</Text>
                    </Stack>
                </Stack>
            </Box>
            <Box width={600} p={1} >
            <InputGroup size='md' >
                <Input
                    fontSize={13}
                    focusBorderColor='blue'
                    width={150}
                    pr='0.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='eth:'
                    variant='unstyled'
                />
                <Input
                    fontSize={13}
                    focusBorderColor='blue'
                    pr='0.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='address:'
                    variant='outline'
                />
                <InputRightElement width='6.5rem' >
                    <Button h='1.75rem' w='5rem' size='sm'
                        box-shadow =' 10 10 0 1px'
                        _focus='none'
                        variant='outline'
                        _hover={{
                            boxShadow: 'sm',
                            background: "gray.900",
                            color: "gray.100",
                        }}
                        _active= "red.300"
                        onClick={() => sendTransaction()}>
                    Send</Button>
                </InputRightElement>
                </InputGroup>
            </Box>
            <Box>
            </Box>
            </Box>

    )
}

