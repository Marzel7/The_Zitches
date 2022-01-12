import React, { useEffect, useState } from 'react'
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core'
import { Flex, Text, Button } from '@chakra-ui/react'
import { AccountModal } from './AccountModal';

export const AccountButton = () => {
    const { account, deactivate, activateBrowserWallet } = useEthers()
    const ens = useLookupAddress()
    const [showModal, setShowModal] = useState(false)

    const [activateError, setActivateError] = useState('')
    const { error } = useEthers()
    useEffect(() => {
        if(error) {
           setActivateError(error.message)
        }
    }, [error])

    const activate = async () => {
        setActivateError('')
        activateBrowserWallet()
    }

    return (
        <>
        <Flex >{activateError}</Flex>
        {showModal && <AccountModal setShowModal={setShowModal} />}
        {account ? (
            <>
             {/* <Text onClick={() => setShowModal(!showModal)}>{ens ?? shortenAddress(account)}</Text> */}
             <Button
                    px={5}
                    size='sm'
                    variant='outline'
                    _hover={{
                        boxShadow: 'sm',
                        background: "gray.900",
                        color: "gray.100",
                    }}
                    _active= "gray.900"
                    onClick={() => deactivate()}>Disconnect</Button>
            </>
        ) :  (
            <Button
                    px={5}
                    size='sm'
                    variant='outline'
                    _hover={{
                        boxShadow: 'sm',
                        background: "gray.900",
                        color: "gray.100",
                      }}
                    _active= "gray.900"
                    onClick={activate}>Connect</Button>
        )}
        </>
    )
}