export class Logger {
    static info(message: string): void {
        console.log(`ℹ️ ${message}`.cyan);
    }

    static success(message: string): void {
        console.log(`✅ ${message}`.green);
    }

    static error(message: string): void {
        console.error(`❌ ${message}`.red);
    }
}