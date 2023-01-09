import { Account } from '@entropy1729/aleo-js';

console.log('This is the background page.');
console.log('Put the background scripts here.');
console.log(chrome)

const settings = { expireTime: 600 };
const contentPorts = {};
let expireTimeLimit = -1;
let pollingInterval = 15000; // 15000 milliseconds
let timeoutId;


chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'background-content') {
    const account = new Account({ seed: 'ce8b23470222bdee5f894ee77b607391' });
    console.log('privateKey: ', account.privateKey().to_string());
    console.log('viewKey: ', account.viewKey().to_string());
    console.log('address: ', account.address().to_string());

    console.log("[background] chrome.runtime.onConnect, background-content", port)
    const tabId = port.sender.tab.id;
    port.onMessage.addListener((message) => {
      console.log("[background] message from contentScript", message)
      switch (message.action) {
        case 'getPublicKey':
          _port.postMessage({
            action: 'getPublicKey:result',
            detail: { publicKey: account.address().to_string() , success: true, error: null }
          })
          break;
        // case 'getBalance':
        //   const _port = contentPorts[tabId]
        //   if (_port) {
        //     _port.postMessage({ action: 'getBalance:result', detail: { balance: myBalance, success: true, error: null } })
        //   } else {
        //     console.log(`[background] port b/w tab ${tabId} and background does not exist`)
        //   }
        //   break;
        // case 'sign':
        //   chrome.storage.local.get("requestQueue", (result) => {
        //     console.log('[background] chrome.storage.local.get("requestQueue")=', result)
        //     const { requestQueue } = result
        //     console.log("[background] requestQueue =", requestQueue)
        //     console.log("[background] requestQueue instanceof Array?", requestQueue instanceof Array, typeof requestQueue)
        //     const newQueue = requestQueue instanceof Array
        //       ? requestQueue
        //       : requestQueue !== undefined && requestQueue !== null
        //         ? [requestQueue]
        //         : []
        //     newQueue.push({ request: message.detail, tabId })
        //     chrome.storage.local.set({ requestQueue: newQueue }, () => {
        //       if (chrome.runtime.lastError) {
        //         console.log("[background] chrome.runtime.lastError=", chrome.runtime.lastError)
        //       }
        //     })
        //   })
        //   break
        default:
          break
      }
    });
  }
})


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && sender.id === chrome.runtime.id) {
    if (msg.method === 'getPublicKey:result' || msg.method === 'sign:result') {
      const tabId = msg.tabId
      const port = contentPorts[tabId]
      if (port) {
        port.postMessage({ action: msg.method, detail: msg.detail })
      }
    }
  }
  return true;
});