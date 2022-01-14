import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import { DAppProvider, Mainnet, Hardhat } from "@usedapp/core";


const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: 'https://mainnet.infura.io/v3/3165a249c65f4198bf57200109b8fadf',
  },
}

ReactDOM.render(
  <React.StrictMode>
    <Router >
      <DAppProvider config={config}>
        <App />
        </DAppProvider>
        </Router>
    </React.StrictMode>,
  document.getElementById('root')
);