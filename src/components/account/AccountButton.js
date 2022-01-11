import React, { useEffect, useState } from 'react'
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core'
import { Flex, Text } from '@chakra-ui/react'
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
        <React.Fragment>
        <Flex>{activateError}</Flex>
        {showModal && <AccountModal setShowModal={setShowModal} />}
        {account ? (
            <>
             <Text onClick={() => setShowModal(!showModal)}>{ens ?? shortenAddress(account)}</Text>
             <Text onClick={() => deactivate()}>Disconnect</Text>
            </>
        ) :  (
            <Text onClick={activate}>Connect!</Text>
        )}
        </React.Fragment>
    )
}