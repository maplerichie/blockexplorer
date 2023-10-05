import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);


function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState({
    hash: "",
    parentHash: "",
    miner: "",
    difficulty: 0,
    timestamp: 0,
    transactions: []
  });

  const getBlock = async (blockNumber) => {
    const block = await alchemy.core.getBlockWithTransactions(blockNumber);
    console.log(block);
    if (blockNumber < 0 || !block) {
      alert(`Block #${blockNumber} not found/exist yet!`);
    } else {
      setBlock(block);
    }
  }


  const getBlockNumber = async () => {
    let blockNumber = await alchemy.core.getBlockNumber()
    setBlockNumber(blockNumber);
    await getBlock(blockNumber);
  }

  useEffect(() => {
    if (!blockNumber) {
      getBlockNumber();
    }
  });

  function handleBlockChange(change) {
    const newBlockNumber = blockNumber + change;
    if (newBlockNumber >= 0) {
      setBlockNumber(newBlockNumber);
      getBlock(blockNumber);
    }
  }

  return <div className="App">
    <div>
      <button onClick={() => handleBlockChange(-1)}>Previous</button>&nbsp;&nbsp;
      <span>Block Number: {blockNumber}</span>&nbsp;&nbsp;
      <button onClick={() => handleBlockChange(1)}>Next</button>
    </div>
    <div className="block-info">
      {block ? (
        <div>
          <h2>Block Info</h2>
          <ul>
            <li>Block Hash: {block.hash}</li>
            <li>Parent Hash: {block.parentHash}</li>
            <li>Miner: {block.miner}</li>
            <li>Difficulty: {block.difficulty}</li>
            <li>Timestamp: {new Date(block.timestamp * 1000).toLocaleString()}</li>
            {/* Add more block info as needed */}
          </ul>
        </div>
      ) : (
        <p>Loading block info...</p>
      )}
    </div>
    <div className="block-transactions">
      <h2>Block Transactions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Transaction Hash</th>
            <th>From</th>
            <th>To</th>
            <th>Value</th>
            <th>Confirmations</th>
          </tr>
        </thead>
        <tbody>
          {block.transactions.map((tx) => (
            <tr key={tx.hash}>
              <td>{tx.hash}</td>
              <td>{tx.from}</td>
              <td>{tx.to}</td>
              <td>{Utils.formatUnits(tx.value, 18)}</td>
              <td>{tx.confirmations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>;
}

export default App;
