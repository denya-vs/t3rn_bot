import { Wallet, JsonRpcProvider, formatUnits } from 'ethers';
import { CONFIG } from '../config/config';


export class WalletProvider {
    private readonly provider: JsonRpcProvider;

    constructor() {
        this.provider = new JsonRpcProvider(CONFIG.RPC_URL);
    }

    createWallet(privateKey: string): Wallet {
        return new Wallet(privateKey, this.provider);
    }

    async getBalance(wallet: Wallet): Promise<string> {
        const balance = await this.provider.getBalance(wallet.address);
        return formatUnits(balance, 'ether');
    }
}