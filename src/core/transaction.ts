import { Wallet } from 'ethers';
import { CONFIG } from '../config/config';
import { NetworkOption, NetworkManager } from './network';
import { getRandomValue, getRandomDelay } from '../utils/delay';
import { transactionData } from '../contracts/contract';
import { Logger } from '../utils/logger';

export class TransactionManager {
    private wallet: Wallet;
    private networkOption: NetworkOption;

    constructor(wallet: Wallet) {
        this.wallet = wallet;
        this.networkOption = NetworkManager.getRandomNetwork();
    }

    async executeTransaction(remainingTx: number): Promise<number> {
        let successfulTx = 0;

        while (remainingTx > 0) {
            try {
                const amount = await this.getAmount();
                if (!amount) {
                    Logger.error('Failed to get the amount. Skipping transaction...');
                    continue;
                }

                const randomValue = getRandomValue(CONFIG.MIN_TRANSACTION_VALUE, CONFIG.MAX_TRANSACTION_VALUE);
                const randomDelay = getRandomDelay(CONFIG.MIN_DELAY_MS, CONFIG.MAX_DELAY_MS);

                const transaction = {
                    data: transactionData(this.wallet.address, amount, this.networkOption),
                    to: CONFIG.CONTRACT_ADDRESS,
                    gasLimit: CONFIG.GAS_LIMIT,
                    gasPrice: CONFIG.GAS_PRICE,
                    from: this.wallet.address,
                    value: randomValue,
                };

                const result = await this.wallet.sendTransaction(transaction);
                Logger.success(`Transaction successful from Arbitrum Sepolia to ${NetworkManager.getNetworkName(this.networkOption)} Sepolia!`);
                Logger.info(`Transaction hash: https://sepolia-explorer.arbitrum.io/tx/${result.hash}`);

                successfulTx++;
                remainingTx--;

                if (remainingTx > 0) {
                    await new Promise(resolve => setTimeout(resolve, randomDelay));
                }
            } catch (error) {
                Logger.error(`Error during transaction: ${error}`);
            }
        }

        return successfulTx;
    }

    private async getAmount(): Promise<string | undefined> {
        return '100000000000000000'; // Например, 0.1 ETH в Wei
    }
}