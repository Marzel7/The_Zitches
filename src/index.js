import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DAppProvider, Hardhat } from "@usedapp/core";


const config = {
  readOnlyChainId: Hardhat.chainId
}

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
    <App />
      </DAppProvider>
    </React.StrictMode>,
  document.getElementById('root')
);

