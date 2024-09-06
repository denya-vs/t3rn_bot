export function getRandomValue(min: bigint, max: bigint): bigint {
    const range = max - min;
    return BigInt(Math.floor(Math.random() * Number(range))) + min;
}

export function getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}