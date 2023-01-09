// import { CustomWindow, DataSignResultEvent, PublicKeyResultEvent, BalanceResultEvent } from '../common/types';
export interface CustomWindow extends Window {
  coinbaseAleo?: any;
}

export interface PublicKeyResultEvent extends Event {
  detail?: {
    publicKey: string;
    success: boolean;
    error: any;
  };
}

console.log('coinbaseAleo');
declare let window: CustomWindow;

const TARGET_ORIGIN = '*';

class CoinbaseAleo {
  //   public signRequest = (payload: any) => {
  //     return new Promise(async (resolve, reject) => {
  //       try {
  //         const data = Object.assign({fromClient: true}, payload);
  //         window.postMessage({action: "sign", detail: data}, TARGET_ORIGIN)
  //         window.addEventListener("sign:result", function signResultListener(event: DataSignResultEvent) {
  //           console.log("[api] sign:result:",event)
  //           console.log("[api] comparing data:",event.detail && event.detail.data,data)
  //           let shouldRespond = true;
  //           if (!event.detail || !event.detail.data) {
  //               throw new Error("Invalid signing result");

  //           } else {
  //               Object.keys(event.detail.data).forEach(field => {
  //                   if (!event.detail || !event.detail.data || !event.detail.data[field] ||
  //                           event.detail.data[field] === undefined || !data[field] ||
  //                           data[field] === undefined || event.detail.data[field] !== data[field]) {
  //                       shouldRespond = false;
  //                   }
  //               })
  //           }
  //           if (shouldRespond) {
  //               window.removeEventListener("sign:result", signResultListener);
  //               resolve(event.detail);
  //           }
  //         })
  //       } catch(e) {
  //         console.log("[api] signRequest error:",e)
  //         reject({ data: null, signature: '', fields: null, success: false, error: e })
  //       }
  //     })
  //   }

  public getPublicKey = () => {
    return new Promise(async (resolve, reject) => {
      try {
        window.postMessage({ action: 'getPublicKey' }, TARGET_ORIGIN);
        window.addEventListener(
          'getPublicKey:result',
          function pubKeyListener(event: PublicKeyResultEvent) {
            console.log('[api] getPublicKey:result:', event);
            resolve(event.detail);
          },
          { once: true }
        );
      } catch (e) {
        console.log('[api] getPublicKey error:', e);
        reject({ publicKey: '', success: false, error: e });
      }
    });
  };

  //   public getBalance = () => {
  //     return new Promise(async (resolve, reject) => {
  //       try {
  //         window.postMessage({action: "getBalance"}, TARGET_ORIGIN)
  //         window.addEventListener("getBalance:result", function pubKeyListener(event: BalanceResultEvent) {
  //           console.log("[api] getBalance:result:",event)
  //           resolve(event.detail)
  //         }, {once: true})
  //       } catch(e) {
  //         console.log("[api] getBalance error:",e)
  //         reject({ balance: '', success: false, error: e })
  //       }
  //     })
  //   }
}

window.coinbaseAleo = new CoinbaseAleo();
// window.dispatchEvent(new CustomEvent("loadedCloudConnect"))
