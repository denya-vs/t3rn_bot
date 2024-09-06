import { WalletProvider } from './core/wallet';
import { TransactionManager } from './core/transaction';
import { Logger } from './utils/logger';
import { displayHeader } from './utils/display';
import * as fs from 'fs';

(async () => {
    displayHeader();
    const privateKeys = JSON.parse(fs.readFileSync('privateKeys.json', 'utf-8'));
    const walletProvider = new WalletProvider();

    const numTx = 5; //Количество транзакций

    for (const privateKey of privateKeys) {
        const wallet = walletProvider.createWallet(privateKey);
        const balance = await walletProvider.getBalance(wallet);

        Logger.info(`Wallet balance: ${balance} ETH`);

        if (parseFloat(balance) < 0.001) {
            Logger.error('Insufficient balance. Skipping this wallet.');
            continue;
        }

        const transactionManager = new TransactionManager(wallet);
        await transactionManager.executeTransaction(numTx);
    }

    Logger.success('All transactions complete!');
})();