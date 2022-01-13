import React from 'react'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { Stack, Text, Box, Divider } from '@chakra-ui/react'
import { ethers } from "ethers";

const STAKING_CONTRACT = '0x00000000219ab540356cBB839Cbe05303d7705Fa'

export default function Balance() {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const stakingBalance = useEtherBalance(STAKING_CONTRACT)

  return (
    <>
        <Box w='720px'
             ml='350px'
             >
          <Stack
                justify='space-between'
                isInline
                p={2.5}
                align='baseline'
                >
              <Text
                fontSize={22}
                fontWeight='semibold'
                ml='0px'
                >Balance</Text>
              </Stack>
            <Box spacing={18}>
            <Stack spacing={2}>

          {stakingBalance && (
                <Box>
                  <Stack isInline fontWeight='semibold' fontSize={13} spacing={0.5} align='baseline'>
                    <Text color='gray.600'>ETH2 staking contract holds:</Text>
                    <Text color='gray.500'>{ethers.utils.formatEther(stakingBalance)}{''}</Text>
                    <Text color='gray.600'>eth</Text>
                  </Stack>
                </Box>
            )}
            {account && (
                <Box >
                  <Stack isInline fontWeight='semibold' fontSize={13} spacing={0.5} color='gray.600'>
                    <Text>Account:</Text>
                    <Text>{account}</Text>
                  </Stack>
                </Box>
              )}

            {userBalance && (
                <Box>
                  <Stack isInline fontWeight='semibold' fontSize={13} spacing={0.5}>
                    <Text color='gray.600'>Ether balance:</Text>
                    <Text color='gray.500'>{formatEther(userBalance)}</Text>
                    <Text color='gray.600'>eth</Text>
                  </Stack>
                </Box>
            )}
            </Stack>
            </Box>
          </Box>
    </>
  )
}
