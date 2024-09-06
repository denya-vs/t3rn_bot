import {Wallet, parseUnits} from 'ethers';
import {CONFIG} from '../config/config';
import {NetworkOption, NetworkManager} from './network';
import {getRandomValue, getRandomDelay} from '../utils/delay';
import {ApiService} from '../services/ApiService';
import {Logger} from '../utils/logger';

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
                const gasPrice = parseUnits('0.1', 'gwei');
                const transaction = {
                    data: this.transactionData(this.wallet.address, amount, this.networkOption),
                    to: CONFIG.CONTRACT_ADDRESS,
                    gasLimit: CONFIG.GAS_LIMIT,
                    gasPrice,
                    from: this.wallet.address,
                    value: parseUnits('0.0001', 'ether'),
                };

                Logger.info(`[ ${new Date().toLocaleTimeString()} ] Sending transaction from ${this.wallet.address}...`);

                const txStartTime = new Date();
                const result = await this.wallet.sendTransaction(transaction);

                Logger.info(`[ ${new Date().toLocaleTimeString()} ] Waiting for transaction to be mined...`);

                // Проверка на null перед использованием
                const receipt = await this.wallet.provider?.waitForTransaction(result.hash);
                if (receipt && receipt.status === 1) {
                    const txEndTime = new Date();
                    Logger.success(`[ ${txEndTime.toLocaleTimeString()} ] Transaction confirmed successfully from Arbitrum Sepolia to ${NetworkManager.getNetworkName(this.networkOption)} Sepolia!`);
                    Logger.info(`[ ${txEndTime.toLocaleTimeString()} ] Transaction hash: https://sepolia-explorer.arbitrum.io/tx/${result.hash}`);
                    Logger.info(`[ ${txEndTime.toLocaleTimeString()} ] Transaction took ${txEndTime.getTime() - txStartTime.getTime()} ms`);

                    successfulTx++;
                } else {
                    Logger.error(`[ ${new Date().toLocaleTimeString()} ] Transaction failed from Arbitrum Sepolia to ${NetworkManager.getNetworkName(this.networkOption)} Sepolia!: https://sepolia-explorer.arbitrum.io/tx/${result.hash}`);
                }
                console.log('');

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
        console.log('');

        return successfulTx;
    }

    private async getAmount(): Promise<string | null> {
        return this.apiService.getAmount(this.networkOption);
    }

    private transactionData(address: string, amount: string, network: NetworkOption): string {
        const chainPrefix = network === NetworkOption.Base ? '0x56591d5962737370' :
            network === NetworkOption.Blast ? '0x56591d59626c7373' :
                network === NetworkOption.Optimism ? '0x56591d596f707370' :
                    '0x0000000000000000'; // Значение по умолчанию, если сеть не определена

        return `${chainPrefix}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000${address.slice(2)}0000000000000000000000000000000000000000000000000000${amount.slice(2)}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005af3107a4000`;
    }
}