import Redis from 'ioredis';
interface Options {
    identifier: string;
    lockTimeout: number;
}
export declare function refreshRedlockSemaphore(clients: Redis[], key: string, limit: number, options: Options): Promise<boolean>;
export {};
