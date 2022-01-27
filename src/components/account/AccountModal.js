// import React from 'react'
// import { Flex } from '@chakra-ui/react'
// import { useEthers, getExplorerAddressLink, useEtherBalance } from '@usedapp/core'
// import { formatEther } from '@ethersproject/units'
// import { BigNumber } from 'ethers'

// const formatter = new Intl.NumberFormat('en-us', {
//     minimumFractionDigits: 4,
//     maximumFractionDigits: 4
// })

// const formatBalance = (balance) => {
//     formatter.format(parseFloat(formatEther)(balance))
// }

// export const AccountModal = (setShowModal) => {
//     const { account, chainId } = useEthers()
//     const balance = useEtherBalance(account)
//     // if(account && chainId) {
//     //     return (
//     //         <Flex onClick={() => setShowModal(false)}>
//     //             <Flex onClick={(e) => e.stopPropagation()}>
//     //             </Flex>
//     //         </Flex>
//     //     )
//     // }
// }
