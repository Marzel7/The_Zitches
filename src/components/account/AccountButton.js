import React, { useEffect, useState } from "react";
import { useEthers, useLookupAddress } from "@usedapp/core";
import { Flex, Box, Button } from "@chakra-ui/react";
import { AccountModal } from "./AccountModal";

export const AccountButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  // const ens = useLookupAddress();
  const [showModal, setShowModal] = useState(false);

  const [activateError, setActivateError] = useState("");
  //const { error } = useEthers();
  // useEffect(() => {
  //   if (error) {
  //     setActivateError(error.message);
  //   }
  // }, [error]);

  const activate = async () => {
    setActivateError("");
    activateBrowserWallet();
  };

  return (
    <Box>
      <Flex>{activateError}</Flex>
      {showModal && <AccountModal setShowModal={setShowModal} />}
      {account ? (
        <>
          <Button variant="outline" size="sm" onClick={() => deactivate()}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button variant="outline" size="sm" onClick={activate}>
          Connect
        </Button>
      )}
    </Box>
  );
};
