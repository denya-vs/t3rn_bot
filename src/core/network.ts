import { CONFIG } from '../config/config';
export enum NetworkOption {
    Base = 'Base',
    Blast = 'Blast',
    Optimism = 'Optimism',
    Arbitrum = 'Arbitrum'
}

export class NetworkManager {
    // Маппинг сетей на идентификаторы для API и адреса контрактов
    private static networkMapping: { [key in NetworkOption]: { apiName: string, explorerUrl: string, contractAddress?: string, rpcUrl: string } } = {
        [NetworkOption.Base]: { apiName: 'bssp', explorerUrl: 'https://base-explorer.com', rpcUrl: CONFIG.RPC_URL_BASE },
        [NetworkOption.Blast]: { apiName: 'blss', explorerUrl: 'https://blast-explorer.com', rpcUrl: CONFIG.RPC_URL_BLAST },
        [NetworkOption.Optimism]: { apiName: 'opsp', explorerUrl: 'https://optimism-sepolia.blockscout.com', contractAddress: CONFIG.CONTRACT_ADDRESS_OP, rpcUrl: CONFIG.RPC_URL_OP },
        [NetworkOption.Arbitrum]: { apiName: 'arbt', explorerUrl: 'https://sepolia-explorer.arbitrum.io', contractAddress: CONFIG.CONTRACT_ADDRESS_ARB, rpcUrl: CONFIG.RPC_URL_ARB }
    };

    // Получение адреса контракта для сети, если он есть
    static getContractAddress(option: NetworkOption): string | null {
        return this.networkMapping[option].contractAddress || null;
    }

    static getRandomNetwork(): NetworkOption {
        const networks = Object.values(NetworkOption);
        return networks[Math.floor(Math.random() * networks.length)];
    }

    static getNetworkName(option: NetworkOption): string {
        return option;
    }

    static getNetworkApiName(option: NetworkOption): string {
        return this.networkMapping[option].apiName;
    }

    static getExplorerUrl(option: NetworkOption): string {
        return this.networkMapping[option].explorerUrl;
    }

    static getNetworkOptionByName(name: string): NetworkOption | null {
        const normalizedName = name.trim().toLowerCase();
        const network = Object.values(NetworkOption).find(option => option.toLowerCase() === normalizedName);
        return network || null;
    }

    static getRpcUrl(network: NetworkOption): string {
        return this.networkMapping[network].rpcUrl;
    }
}