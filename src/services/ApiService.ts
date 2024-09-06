import axios from 'axios';
import { CONFIG } from '../config/config';
import { NetworkOption } from '../core/network';

export class ApiService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = CONFIG.API_URL;
    }

    async getAmount(network: NetworkOption): Promise<string | null> {
        const networkMapping: { [key in NetworkOption]: string } = {
            [NetworkOption.Base]: 'bssp',
            [NetworkOption.Blast]: 'blss',
            [NetworkOption.Optimism]: 'opsp',
        };

        const toChain = networkMapping[network];

        if (!toChain) {
            console.error('Invalid network option');
            return null;
        }

        try {
            const { data } = await axios.post(this.apiUrl, {
                fromAsset: 'eth',
                toAsset: 'eth',
                fromChain: 'arbt',
                toChain: toChain,
                amountWei: '100000000000000',
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