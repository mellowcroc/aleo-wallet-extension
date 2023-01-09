import { Account, NodeConnection, Signature } from '@entropy1729/aleo-js';
import SafeEventEmitter from '@metamask/safe-event-emitter';

export interface CustomWindow extends Window {
  coinbaseAleo?: any;
}

declare let window: CustomWindow;

export const enum WrapperType {
  LeoWallet = 'LeoWallet',
  AIP1193Wallet = 'AIP1193Wallet',
}

export const enum RPCErrorCode {
  UserRejectedRequest = 4001,
  Unauthorized = 4100,
  UnsupportedMethod = 4200,
  Disconnected = 4900,
  ChainDisconnected = 4901,
}

export interface SimpleEventEmitter {
  // add listener
  on(event: string, listener: any): void;
  // add one-time listener
  once(event: string, listener: any): void;
  // remove listener
  removeListener(event: string, listener: any): void;
  // removeListener alias
  off(event: string, listener: any): void;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export interface AIP1193 extends SimpleEventEmitter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

class CoinbaseAleo extends SafeEventEmitter implements AIP1193 {
  account: Account;
  connection: NodeConnection;

  constructor() {
    super();
    const enc = new TextEncoder();
    this.account = new Account({
      seed: enc.encode('ce8b23470222bdee5f894ee77b607391'),
    });
    this.connection = new NodeConnection('http://vm.aleo.org/api');
    this.connection.setAccount(this.account);
  }
  connect(): Promise<any> {
    return new Promise((resolve, reject) => {
      const publicKey = this.getPublicKey();
      if (publicKey) {
        this.emit('connect', { publicKey });
        resolve({ publicKey });
      } else {
        const error = {
          message: `Unable to connect`,
          code: RPCErrorCode.Disconnected,
          data: {},
        };
        this.emit('disconnect', error);
        reject(error);
      }
    });
  }
  disconnect(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.removeAllListeners();
      const resp = {
        message: `Successfully disconnected`,
        code: RPCErrorCode.Disconnected,
        data: {},
      };
      this.emit('disconnect', resp);
      resolve(resp);
    });
  }

  public getPublicKey = () => {
    return this.account.address().to_string();
  };

  public async getLatestHeight() {
    const height = await this.connection.getLatestHeight();
    return height;
  }

  public sign(msg: string) {
    const enc = new TextEncoder();
    const sig = this.account.sign(enc.encode(msg));
    return sig.to_string();
  }

  public verify(msg: string, sig: string) {
    const enc = new TextEncoder();
    const signature = Signature.from_string(sig);

    return this.account.verify(enc.encode(msg), signature);
  }
}

const instance = new CoinbaseAleo();
window.coinbaseAleo = instance;
