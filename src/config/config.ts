import { parseUnits } from 'ethers';

export const CONFIG = {
    GAS_LIMIT: 2000000,
    GAS_PRICE: parseUnits('0.1', 'gwei'),
    MIN_TRANSACTION_VALUE: 0.01,
    MAX_TRANSACTION_VALUE: 0.013,
    MIN_DELAY_MS: 10000,
    MAX_DELAY_MS: 60000,
    RPC_URL_ARB: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
    RPC_URL_OP: "https://sepolia.optimism.io",
    RPC_URL_BLAST: "https://sepolia.optimism.io",
    RPC_URL_BASE: "https://sepolia.optimism.io",
    CONTRACT_ADDRESS_ARB: "0x8D86c3573928CE125f9b2df59918c383aa2B514D",
    CONTRACT_ADDRESS_OP: "0xF221750e52aA080835d2957F2Eed0d5d7dDD8C38",
    API_URL: "https://pricer.t1rn.io/estimate"
};