export enum NetworkOption {
    Base = 'Base',
    Blast = 'Blast',
    Optimism = 'Optimism',
    Arbitrum = 'Arbitrum'
}

export class NetworkManager {
    // Маппинг сетей на идентификаторы для API
    private static networkMapping: { [key in NetworkOption]: { apiName: string, explorerUrl: string } } = {
        [NetworkOption.Base]: { apiName: 'bssp', explorerUrl: 'https://base-explorer.com' },
        [NetworkOption.Blast]: { apiName: 'blss', explorerUrl: 'https://blast-explorer.com' },
        [NetworkOption.Optimism]: { apiName: 'opsp', explorerUrl: 'https://optimism-explorer.com' },
        [NetworkOption.Arbitrum]: { apiName: 'arbt', explorerUrl: 'https://arbitrum-explorer.com' }  // Добавляем Arbitrum в маппинг
    };

    static getRandomNetwork(): NetworkOption {
        const networks = Object.values(NetworkOption);
        return networks[Math.floor(Math.random() * networks.length)];
    }

    // Получение имени сети для отображения
    static getNetworkName(option: NetworkOption): string {
        return option;
    }

    // Получение имени сети для использования в API (например, bssp, blss)
    static getNetworkApiName(option: NetworkOption): string {
        return this.networkMapping[option].apiName;
    }

    // Опционально: получение URL для explorer, если нужно
    static getExplorerUrl(option: NetworkOption): string {
        return this.networkMapping[option].explorerUrl;
    }

    static getNetworkOptionByName(name: string): NetworkOption | null {
        const normalizedName = name.trim().toLowerCase();
        const network = Object.values(NetworkOption).find(option => option.toLowerCase() === normalizedName);
        return network || null;
    }
}