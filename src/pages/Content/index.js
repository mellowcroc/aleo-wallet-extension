import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

let numTries = 0;

function loadScript() {
  numTries++;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('api.bundle.js');

    script.onload = () => resolve(script);
    script.onerror = (e) => reject(new Error("[contentScript] Script load error: " + e));

    (document.head || document.documentElement).appendChild(script);
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
  });
}

loadScript()
.then(
  (script) => { attachListeners(); },
  (error) => {
    console.log(`Error: ${error.message}`);
    if (numTries < 10) {
      loadScript();
    }
  }
);

function attachListeners() {
  const contentPort = chrome.runtime.connect({
     name: 'background-content'
  });

  const loadedEvent = new CustomEvent('scriptLoaded');
  window.dispatchEvent(loadedEvent);

  window.addEventListener("message", (event) => {
    const { action, detail } = event.data
    console.log(`[contentScript] ${action} message from window`)
    if (action === 'sign') {
      contentPort.postMessage({ action, detail })
    } else if (action === 'getPublicKey' || action === 'getBalance') {
      contentPort.postMessage({ action })
    }
  })

  contentPort.onMessage.addListener((message) => {
    console.log("[contentScript] message from background:",message);
    const { action, detail } = message
    if (action === 'sign:result' || action === 'getPublicKey:result' || action === 'getBalance:result') {
      const customEvent = new CustomEvent(action, { detail });
      window.dispatchEvent(customEvent)
    }
  })
}
