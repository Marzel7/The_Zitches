import React from "react";
import {
  Box,
  Text,
  Stack,
  Button,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";

export default function search() {
  return (
    <>
      <Box w="600px" ml="300px" py={10}>
        <Text textStyle="h4">TKN Balance</Text>
        <Stack>
          <Box width={250} px={1} textStyle="h5">
            <InputGroup size="md">
              {/* <Input
              //value={amount}
              //onChange={(e) => handle(e.currentTarget.value)}
              //disabled={disabled}
              fontSize={13}
              focusBorderColor="blue"
              width={75}
              pr="0.5rem"
              type={"text"}
              placeholder="tokens:"
              variant="unstyled"
            /> */}

              <Input
                // value={ethValue}
                //onChange={(e) => setEthValue(e.currentTarget.value)}
                fontSize={13}
                focusBorderColor="blue"
                pr="0.5rem"
                placeholder="address"
                variant="outline"
              />
              <InputRightElement width="6.5rem">
                <Button
                  variant="outline"
                  focusBorderColor="blue"
                  size="sm"
                  //onClick={(e) => handleBuyTokens(amount)}
                  variant="outline"
                >
                  Search
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
