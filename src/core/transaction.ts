import { Wallet, parseUnits } from 'ethers';
import { CONFIG } from '../config/config';
import { NetworkOption, NetworkManager } from './network';
import { getRandomValue, getRandomDelay } from '../utils/delay';
import { ApiService } from '../services/ApiService';
import { Logger } from '../utils/logger';

export class TransactionManager {
    private wallet: Wallet;
    private apiService: ApiService;

    constructor(wallet: Wallet) {
        this.wallet = wallet;
        this.apiService = new ApiService();
    }

    async executeTransaction(remainingTx: number, fromNetwork: NetworkOption): Promise<number> {
        let successfulTx = 0;
        const startTime = new Date();

        Logger.info(`[ ${startTime.toLocaleTimeString()} ] Started processing transactions`);

        while (remainingTx > 0) {
            try {
                // Выбор случайной сети для исходящей транзакции
                let toNetworkOption = NetworkManager.getRandomNetwork();

                // Проверка на совпадение сетей
                while (toNetworkOption === fromNetwork) {
                    Logger.info(`[ ${new Date().toLocaleTimeString()} ] Skipping transaction, as both networks are ${NetworkManager.getNetworkName(fromNetwork)}`);
                    toNetworkOption = NetworkManager.getRandomNetwork();
                }

                const amount = await this.getAmount(fromNetwork, toNetworkOption);
                if (!amount) {
                    Logger.error(`[ ${new Date().toLocaleTimeString()} ] Failed to get the amount. Skipping transaction...`);
                    continue;
                }

                const randomDelay = getRandomDelay(CONFIG.MIN_DELAY_MS, CONFIG.MAX_DELAY_MS);
                const randomValue = getRandomValue(CONFIG.MIN_TRANSACTION_VALUE, CONFIG.MAX_TRANSACTION_VALUE).toFixed(4);

                const contractAddress = NetworkManager.getContractAddress(fromNetwork);  // Получаем адрес контракта из NetworkManager

                const transaction = {
                    data: this.transactionData(this.wallet.address, amount, toNetworkOption),
                    to: contractAddress,
                    gasLimit: CONFIG.GAS_LIMIT,
                    maxFeePerGas: CONFIG.GAS_PRICE,
                    maxPriorityFeePerGas: CONFIG.GAS_PRICE,
                    from: this.wallet.address,
                    value: parseUnits(randomValue, 'ether'),
                };

                Logger.info(`[ ${new Date().toLocaleTimeString()} ] Sending transaction ${randomValue} ETH from ${NetworkManager.getNetworkName(fromNetwork)} to ${NetworkManager.getNetworkName(toNetworkOption)}...`);

                const txStartTime = new Date();
                const result = await this.wallet.sendTransaction(transaction);

                Logger.info(`[ ${new Date().toLocaleTimeString()} ] Waiting for transaction to be mined...`);

                const receipt = await this.wallet.provider?.waitForTransaction(result.hash);
                if (receipt && receipt.status === 1) {
                    const txEndTime = new Date();
                    Logger.success(`[ ${txEndTime.toLocaleTimeString()} ] Transaction confirmed successfully from ${NetworkManager.getNetworkName(fromNetwork)} to ${NetworkManager.getNetworkName(toNetworkOption)}!`);
                    Logger.info(`[ ${txEndTime.toLocaleTimeString()} ] Transaction hash: ${NetworkManager.getExplorerUrl(fromNetwork)}/tx/${result.hash}`);
                    Logger.info(`[ ${txEndTime.toLocaleTimeString()} ] Transaction took ${txEndTime.getTime() - txStartTime.getTime()} ms`);

                    successfulTx++;
                } else {
                    Logger.error(`[ ${new Date().toLocaleTimeString()} ] Transaction failed from ${NetworkManager.getNetworkName(fromNetwork)} to ${NetworkManager.getNetworkName(toNetworkOption)}!: ${NetworkManager.getExplorerUrl(fromNetwork)}/tx/${result.hash}`);
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

    private async getAmount(fromNetwork: NetworkOption, toNetwork: NetworkOption): Promise<string | null> {
        return this.apiService.getAmount(fromNetwork, toNetwork);
    }

    private transactionData(address: string, amount: string, network: NetworkOption): string {
        const chainPrefix = network === NetworkOption.Base ? '0x56591d5962737370' :
            network === NetworkOption.Blast ? '0x56591d59626c7373' :
                network === NetworkOption.Optimism ? '0x56591d596f707370' :
                    '0x0000000000000000';

        return `${chainPrefix}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000${address.slice(2)}00000000000000000000000000000000000000000000000000${amount.slice(2)}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002386f26fc10000`;
    }
}