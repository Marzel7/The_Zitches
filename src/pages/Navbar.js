import { Box, useColorModeValue, Stack, useColorMode } from "@chakra-ui/react";
import { AccountButton } from "../components/account/AccountButton";
import { Link } from "react-router-dom";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box py={2} px={8} textStyle="h4">
        <Stack isInline align="baseline" spacing={20}>
          <Link to="/account">Stake</Link>
          <Link to="/price">Prices</Link>
          <Link to="/block">Block</Link>
          <Link to="/send">Send</Link>
          <Link to="/transactions">Transactions</Link>
          <Stack isInline align="baseline" spacing={350}>
            <AccountButton />
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
