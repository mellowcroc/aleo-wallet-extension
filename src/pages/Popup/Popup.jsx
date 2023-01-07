import { Account } from '@entropy1729/aleo-js';
import { NodeConnection } from '@entropy1729/aleo-js';
import './Popup.css';
import React, { useEffect, useState } from 'react';

const Popup = () => {
  const account = new Account({ seed: 'ce8b23470222bdee5f894ee77b607391' });
  console.log('privateKey: ', account.privateKey().to_string());
  console.log('viewKey: ', account.viewKey().to_string());
  console.log('address: ', account.address().to_string());
  let connection = new NodeConnection('http://vm.aleo.org/api');
  connection.setAccount(account);
  // const allCipherTexts = await connection.getAllCiphertexts();
  // console.log('allCipherTexts: ', allCipherTexts);
  const [latestHeight, setLatestHeight] = useState();

  useEffect(() => {
    async function getLatestHeight() {
      try {
        const height = await connection.getLatestHeight();
        console.log('height: ', height);
        setLatestHeight(height);
      } catch (err) {
        console.log(err);
      }
    }
    getLatestHeight();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>Address: {account.address().to_string()}</p>
        <p>View Key: {account.viewKey().to_string()}</p>
        <p>Current block height: {latestHeight}</p>
      </header>
    </div>
  );
};

export default Popup;
