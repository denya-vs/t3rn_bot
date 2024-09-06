import { parseUnits } from 'ethers';

export const CONFIG = {
    GAS_LIMIT: 2000000,
    GAS_PRICE: parseUnits('0.1', 'gwei'),
    MIN_TRANSACTION_VALUE: parseUnits('0.00005', 'ether'),
    MAX_TRANSACTION_VALUE: parseUnits('0.0002', 'ether'),
    MIN_DELAY_MS: 10000,
    MAX_DELAY_MS: 60000,
    RPC_URL: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
    CONTRACT_ADDRESS: "0x8D86c3573928CE125f9b2df59918c383aa2B514D"
};