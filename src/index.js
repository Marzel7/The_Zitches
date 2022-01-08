import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import { DAppProvider, Hardhat } from "@usedapp/core";


const config = {
  readOnlyChainId: Hardhat.chainId
}

ReactDOM.render(
  <React.StrictMode>
      <DAppProvider config={config}>
        <Router >
          <App />
        </Router>
      </DAppProvider>
    </React.StrictMode>,
  document.getElementById('root')
);

