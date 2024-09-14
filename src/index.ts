import { WalletProvider } from './core/wallet';
import { TransactionManager } from './core/transaction';
import { Logger } from './utils/logger';
import { displayHeader } from './utils/display';
import * as fs from 'fs';
import * as readline from 'readline';
import { NetworkManager } from './core/network';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
    displayHeader();

    const privateKeys = JSON.parse(fs.readFileSync('privateKeys.json', 'utf-8'));
    const walletProvider = new WalletProvider();

    // Запрос количества транзакций
    const numTxInput = await askQuestion('Enter the number of transactions to process: ');
    const numTx = parseInt(numTxInput, 10);

    if (isNaN(numTx) || numTx <= 0) {
        Logger.error('Invalid number of transactions. Exiting...');
        rl.close();
        return;
    }

    // Запрос исходной сети
    const fromNetworkInput = await askQuestion('Enter the source network (Base, Blast, Optimism, Arbitrum): ');
    const fromNetwork = NetworkManager.getNetworkOptionByName(fromNetworkInput.trim());

    if (!fromNetwork) {
        Logger.error('Invalid network option. Exiting...');
        rl.close();
        return;
    }

    Logger.info(`Processing ${numTx} transactions for each wallet on network ${NetworkManager.getNetworkName(fromNetwork)}...`);

    for (const privateKey of privateKeys) {
        const wallet = walletProvider.createWallet(privateKey);
        const balance = await walletProvider.getBalance(wallet);

        Logger.info(`Wallet balance for ${wallet.address}: ${balance} ETH`);
        console.log('');

        if (parseFloat(balance) < 0.001) {
            Logger.error('Insufficient balance. Skipping this wallet.');
            continue;
        }

        const transactionManager = new TransactionManager(wallet);
        const successfulTx = await transactionManager.executeTransaction(numTx, fromNetwork);

        Logger.success(`Successfully processed ${successfulTx} transactions for wallet ${wallet.address}`);
    }

    Logger.success('All transactions complete!');
    console.log('');
    rl.close();
})();