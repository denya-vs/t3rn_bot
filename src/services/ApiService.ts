import axios from 'axios';
import { CONFIG } from '../config/config';
import { NetworkOption, NetworkManager } from '../core/network';

export class ApiService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = CONFIG.API_URL;
    }

    async getAmount(fromNetwork: NetworkOption, toNetwork: NetworkOption): Promise<string | null> {
        const fromChain = NetworkManager.getNetworkApiName(fromNetwork);
        const toChain = NetworkManager.getNetworkApiName(toNetwork);

        if (!fromChain || !toChain) {
            console.error('Invalid network option');
            return null;
        }

        try {
            const { data } = await axios.post(this.apiUrl, {
                fromAsset: 'eth',
                toAsset: 'eth',
                fromChain: fromChain,
                toChain: toChain,
                amountWei: '10000000000000000',
                executorTipUSD: 0,
                overpayOptionPercentage: 0,
                spreadOptionPercentage: 0,
            });

            return data.estimatedReceivedAmountWei.hex;
        } catch (error) {
            console.error(`Error in Get Amount: ${error}`);
            return null;
        }
    }
}