import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Text,
  TabPanel,
  ButtonGroup,
  Button,
  Box,
} from "@chakra-ui/react";

import React, { useState, useEffect } from "react";

export default function TransactionType() {
  const types = ["Buy", "Sell"];
  const [active, setActive] = useState(types[0]);
  const [disabledBuy, setDisableBuy] = useState(0);
  const [disabledSell, setDisableSell] = useState(1);
  const [index, setIndex] = useState(false);

  const handleWithdrawBtn = (type) => {
    console.log(type);
    if (type == "Buy") {
      setDisableBuy(true);
      setDisableSell(false);
    } else {
      setDisableBuy(false);
      setDisableSell(true);
    }
  };
  useEffect(() => {
    // console.log(active);
    // console.log(index);
  }, [active]);

  return (
    <>
      <Tabs>
        <ButtonGroup textStyle="h5" ml={200}>
          {types.map((type) => (
            <Button
              key={type}
              active={active === type}
              onClick={() => handleWithdrawBtn(type)}
              variant={"outline"}
              size="sm"
              fontSize={11}
              disabled={type === "Buy" ? disabledBuy : disabledSell}
            >
              {type}
            </Button>
          ))}
        </ButtonGroup>
      </Tabs>
    </>
  );
}
