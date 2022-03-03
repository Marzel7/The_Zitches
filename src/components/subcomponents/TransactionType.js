import { Tabs, Text, ButtonGroup, Button } from "@chakra-ui/react";

import React, { useState } from "react";

export default function TransactionType({ purchaseType }) {
  const types = ["Buy", "Sell"];
  const [active, setActive] = useState("Sell");
  const [disabledBuy, setDisableBuy] = useState(0);
  const [disabledSell, setDisableSell] = useState(1);

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
        <ButtonGroup ml={200}>
          {types.map((type) => (
            <Button
              key={type}
              // active={active === type}
              onClick={() => handleWithdrawBtn(type)}
              variant={"empty"}
              size="sm"
              fontSize={11}
              disabled={type === "Buy" ? disabledBuy : disabledSell}
            >
              <Text>{type}</Text>
            </Button>
          ))}
        </ButtonGroup>
      </Tabs>
    </>
  );
}
