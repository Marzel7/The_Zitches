import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import {
  DAppProvider,
  Mainnet,
  Hardhat,
  Rinkeby,
  Localhost,
} from "@usedapp/core";
import { ColorModeScript } from "@chakra-ui/react";

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]:
      "https://mainnet.infura.io/v3/8649809659614ef689cc894b72733570",
  },
};

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <DAppProvider config={config}>
        <App />
      </DAppProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
