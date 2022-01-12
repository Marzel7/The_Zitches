import React from 'react'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { Stack, Text, Box } from '@chakra-ui/react'
// import { Container, ContentBlock, ContentRow, MainContent, Section, SectionRow } from '../components/base/base'
// import { Text } from '../typography/Text'
// import { TextInline } from '../typography/Text'
// import { Title } from '../typography/Title'

import { AccountButton } from '../components/account/AccountButton'

const STAKING_CONTRACT = '0x00000000219ab540356cBB839Cbe05303d7705Fa'

export default function Balance() {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)
  const stakingBalance = useEtherBalance(STAKING_CONTRACT)

  return (
    <>
        <Box w='720px'
             ml='260px'>
          <Stack
                justify='space-between'
                isInline
                p={4}
                align='baseline'
                >
              <Text
                fontSize={30}
                fontWeight='semibold'
                ml='0px'
                >Balance</Text>
              <AccountButton />
          </Stack>
            <Box
                justify={'center'}
                mx='auto'
                bg='gray.400'
                p={10}
                overflow='hidden'>
            </Box>
          {/* {stakingBalance && (
                <Box>
                <Text>ETH2 staking contract holds:</Text> {formatEther(stakingBalance)}{' '}
                <Text>ETH</Text>
                </Box>
            )} */}
            {/* {account && (
                <Box>
                <Text>Account:</Text> {account}
                </Box>
              )}
            {userBalance && (
                <Box>
                <Text>Ether balance:</Text> {formatEther(userBalance)} <Text>ETH</Text>
                </Box>
            )} */}
        </Box>
    </>
  )
}
