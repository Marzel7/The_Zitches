import { Tabs, Text, ButtonGroup, Button } from "@chakra-ui/react";

import React, { useState } from "react";

export default function TransactionType({ purchaseType }) {
  const types = ["Buy", "Sell"];

  const [active, setActive] = useState("Buy");
  const [disabledBuy, setDisableBuy] = useState(1);
  const [disabledSell, setDisableSell] = useState(0);

  const handleWithdrawBtn = (type) => {
    if (type == "Buy") {
      setDisableBuy(true);
      setDisableSell(false);
    } else {
      setDisableBuy(false);
      setDisableSell(true);
    }

    purchaseType(type);
  };

  return (
    <>
      <Tabs>
        <ButtonGroup ml={230}>
          {types.map((type) => (
            <Button
              key={type}
              //active={active === type}
              onClick={() => handleWithdrawBtn(type)}
              variant={"empty"}
              size="sm"
              fontSize={11}
              disabled={type === "Sell" ? disabledSell : disabledBuy}
            >
              <Text>{type}</Text>
            </Button>
          ))}
        </ButtonGroup>
      </Tabs>
    </>
  );
}
