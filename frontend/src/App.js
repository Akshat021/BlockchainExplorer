import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css"


function App() {
  const [provider, setProvider] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [blockData, setBlockData] = useState(null);
  const [txdata, setTxdata] = useState(null);

  useEffect(() => {
    async function loadProvider() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider);
        try {
          await window.ethereum.enable();
          setProvider(provider);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setConnectedAddress(address);
        } catch (error) {
          console.error(error);
        }
      }
    }
    loadProvider();
  }, []);

  const handleBlockNumberSubmit = async (event) => {
    event.preventDefault();
    const blockNumber = parseInt(event.target.elements.blockNumber.value);
    if (!blockNumber) return;
    let block = null;
    if (provider) block = await provider.getBlock(blockNumber);
    else {
      block = await fetch(
        `https://blockchain-explorer-api.onrender.com/block/${event.target.elements.blockNumber.value}`
      );
      block = await block.json();
    }

    setBlockData(block);
  };

  const handleBlockHashSubmit = async (event) => {
    event.preventDefault();
    const blockHash = event.target.elements.blockHash.value;
    if (!blockHash) return;
    let block = null;
    if (provider) block = await provider.getBlock(blockHash);
    else {
      block = await fetch(
        `https://blockchain-explorer-api.onrender.com/block/${event.target.elements.blockHash.value}`
      );
      block = await block.json();
    }
    setBlockData(block);
  };

  const handleTransactionSubmit = async (event) => {
    event.preventDefault();
    const txHash = event.target.elements.transactionHash.value;
    if (!txHash) return;
    let tx = null;

    if (provider) tx = await provider.getTransaction(txHash);
    else {
      tx = await fetch(
        `https://blockchain-explorer-api.onrender.com/tx/${event.target.elements.transactionHash.value}`
      );
      tx = await tx.json();
    }
    console.log(tx);
    setTxdata(tx);
  };

  return (
    <div className="container">
      <h1 className="heading">Blockchain Explorer</h1>
      <div>
        {provider ? (
          <div>
            <h2>MetaMask Connected</h2>
            <p>Connected Address: {connectedAddress}</p>
            <form onSubmit={handleBlockNumberSubmit}>
              <label htmlFor="blockNumber">Block Number:</label>
              <input type="number" id="blockNumber" name="blockNumber" />
              <button type="submit">Fetch Block</button>
            </form>
            <form onSubmit={handleBlockHashSubmit}>
              <label htmlFor="blockHash">Block Hash:</label>
              <input type="text" id="blockHash" name="blockHash" />
              <button type="submit">Fetch Block</button>
            </form>
            <form onSubmit={handleTransactionSubmit}>
              <label htmlFor="transactionHash">Transaction Hash:</label>
              <input type="text" id="transactionHash" name="transactionHash" />
              <button type="submit">Fetch Transaction</button>
            </form>
          </div>
        ) : (
          <div className="heading">
            <h2>Requesting to server</h2>
            <form onSubmit={handleBlockNumberSubmit}>
              <label htmlFor="blockNumber">Block Number:</label>
              <input type="number" id="blockNumber" name="blockNumber" />
              <button type="submit">Fetch Block</button>
            </form>
            <form onSubmit={handleBlockHashSubmit}>
              <label htmlFor="blockHash">Block Hash:</label>
              <input type="text" id="blockHash" name="blockHash" />
              <button type="submit">Fetch Block</button>
            </form>
            <form onSubmit={handleTransactionSubmit}>
              <label htmlFor="transactionHash">Transaction Hash:</label>
              <input type="text" id="transactionHash" name="transactionHash" />
              <button type="submit">Fetch Transaction</button>
            </form>
          </div>
        )}
      </div>

      {blockData && (
        <div>
          <h2>Block Data:</h2>
          <p>Number: {blockData.number}</p>
          <p>Hash: {blockData.hash}</p>
          <p>
            Timestamp: {new Date(blockData.timestamp * 1000).toLocaleString()}
          </p>
          <p>Transactions: {blockData.transactions.length}</p>
        </div>
      )}

      {txdata && (
        <div>
          <h2>Transaction Data:</h2>
          <p>blockNumber: {txdata.blockNumber}</p>
          <p>transactionIndex: {txdata.transactionIndex}</p>
          <p>Fee Recipient: {txdata.to}</p>
          <p>Nonce: {txdata.nonce}</p>
        </div>
      )}
    </div>
  );
}

export default App;
