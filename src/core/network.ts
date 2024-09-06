export enum NetworkOption {
    Base = 'Base',
    Blast = 'Blast',
    Optimism = 'Optimism',
}

export class NetworkManager {
    static getRandomNetwork(): NetworkOption {
        const networks = Object.values(NetworkOption);
        return networks[Math.floor(Math.random() * networks.length)];
    }

    static getNetworkName(option: NetworkOption): string {
        return option;
    }
}