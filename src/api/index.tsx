import { Account, NodeConnection, Signature } from '@entropy1729/aleo-js';

export interface CustomWindow extends Window {
  coinbaseAleo?: any;
}

declare let window: CustomWindow;

class CoinbaseAleo {
  account: Account;
  connection: NodeConnection;

  constructor() {
    const enc = new TextEncoder();
    this.account = new Account({
      seed: enc.encode('ce8b23470222bdee5f894ee77b607391'),
    });
    this.connection = new NodeConnection('http://vm.aleo.org/api');
    this.connection.setAccount(this.account);
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

window.coinbaseAleo = new CoinbaseAleo();
