import { Wallet } from 'ethers';
import { CONFIG } from '../config/config';
import { NetworkOption, NetworkManager } from './network';
import { getRandomValue, getRandomDelay } from '../utils/delay';
import { ApiService } from '../services/ApiService';
import { Logger } from '../utils/logger';

export class TransactionManager {
    private wallet: Wallet;
    private networkOption: NetworkOption;
    private apiService: ApiService;

    constructor(wallet: Wallet) {
        this.wallet = wallet;
        this.networkOption = NetworkManager.getRandomNetwork();
        this.apiService = new ApiService();
    }

    async executeTransaction(remainingTx: number): Promise<number> {
        let successfulTx = 0;
        const startTime = new Date();

        Logger.info(`[ ${startTime.toLocaleTimeString()} ] Started processing transactions`);

        while (remainingTx > 0) {
            try {
                const amount = await this.getAmount();
                if (!amount) {
                    Logger.error(`[ ${new Date().toLocaleTimeString()} ] Failed to get the amount. Skipping transaction...`);
                    continue;
                }

                const randomValue = getRandomValue(CONFIG.MIN_TRANSACTION_VALUE, CONFIG.MAX_TRANSACTION_VALUE);
                const randomDelay = getRandomDelay(CONFIG.MIN_DELAY_MS, CONFIG.MAX_DELAY_MS);

                const transaction = {
                    data: this.transactionData(this.wallet.address, amount, this.networkOption),
                    to: CONFIG.CONTRACT_ADDRESS,
                    gasLimit: CONFIG.GAS_LIMIT,
                    gasPrice: CONFIG.GAS_PRICE,
                    from: this.wallet.address,
                    value: randomValue,
                };

                Logger.info(`[ ${new Date().toLocaleTimeString()} ] Sending transaction from ${this.wallet.address}...`);

                const txStartTime = new Date();
                const result = await this.wallet.sendTransaction(transaction);
                const txEndTime = new Date();

                Logger.success(`[ ${txEndTime.toLocaleTimeString()} ] Transaction successful from Arbitrum Sepolia to ${NetworkManager.getNetworkName(this.networkOption)} Sepolia!`);
                Logger.info(`[ ${txEndTime.toLocaleTimeString()} ] Transaction hash: https://sepolia-explorer.arbitrum.io/tx/${result.hash}`);
                Logger.info(`[ ${txEndTime.toLocaleTimeString()} ] Transaction took ${txEndTime.getTime() - txStartTime.getTime()} ms`);

                successfulTx++;
                remainingTx--;

                if (remainingTx > 0) {
                    const delay = randomDelay;
                    Logger.info(`[ ${new Date().toLocaleTimeString()} ] Waiting for ${delay} ms before next transaction...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (error) {
                Logger.error(`[ ${new Date().toLocaleTimeString()} ] Error during transaction: ${error}`);
            }
        }

        const endTime = new Date();
        Logger.info(`[ ${endTime.toLocaleTimeString()} ] Completed processing transactions`);
        Logger.info(`[ ${endTime.toLocaleTimeString()} ] Total time taken: ${endTime.getTime() - startTime.getTime()} ms`);

        return successfulTx;
    }

    private async getAmount(): Promise<string | null> {
        return this.apiService.getAmount(this.networkOption);
    }

    private transactionData(address: string, amount: string, network: NetworkOption): string {
        const chainMapping: { [key in NetworkOption]: string } = {
            [NetworkOption.Base]: '0x56591d5962737370',
            [NetworkOption.Blast]: '0x56591d59626c7373',
            [NetworkOption.Optimism]: '0x56591d596f707370',
        };

        const chainPrefix = chainMapping[network];

        return `${chainPrefix}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000${address.slice(2)}0000000000000000000000000000000000000000000000000000${amount.slice(2)}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005af3107a4000`;
    }
}