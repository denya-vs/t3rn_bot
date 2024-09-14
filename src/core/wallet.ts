import { Wallet, JsonRpcProvider, formatUnits } from 'ethers';
import { NetworkOption, NetworkManager } from './network';

export class WalletProvider {
    private readonly provider: JsonRpcProvider;

    constructor(network: NetworkOption) {
        const rpcUrl = NetworkManager.getRpcUrl(network);
        this.provider = new JsonRpcProvider(rpcUrl);
    }

    createWallet(privateKey: string): Wallet {
        return new Wallet(privateKey, this.provider);
    }

    async getBalance(wallet: Wallet): Promise<string> {
        const balance = await this.provider.getBalance(wallet.address);
        return formatUnits(balance, 'ether');
    }
}