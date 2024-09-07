export function getRandomValue(min: number, max: number): number {
    const range = max - min;
    return Math.floor(Math.random() * Number(range)) + min;
}

export function getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}