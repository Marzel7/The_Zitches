import logo from '../logo.svg';
import '../App.css';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import SimpleStorageContract from '../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json'
import SimpleStorage from '../artifacts/SimpleStorage-address.json'
import Navbar from './Navbar'

function App() {

  const [simpleStorage, setSimpleStorage] = useState(null)
  // User and Contract Info
  const [account, setAccount] = useState(null)
  const [number, setNumber] = useState(0)
  const [myNumber, setMyNumber] = useState(0)

  // Loading & Error Messages
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if(!account) {
      console.log('Establishing connection with Metamask....')
      loadBlockchainData()
    } else {
      // Showcase useEffect being called everytime number updates
      console.log(number)
    }
  }, [number, account])

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts'})
  }

  const loadBlockchainData = async () => {
    try {
      // Await user login
      setMessage('Awaiting MetaMask Login...')
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(SimpleStorage.address, SimpleStorageContract.abi, signer)
      console.log('Contract loaded', contract.address)
      // Fetch storage value
      let result = await contract.get()
      setNumber(result)

      setMessage("")
      setIsLoading(false)
    } catch {
      setMessage('MetaMask not detected, or contract not deployed to current network')
    }
  }



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
