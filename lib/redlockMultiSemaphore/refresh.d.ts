import Redis from 'ioredis';
interface Options {
    identifier: string;
    lockTimeout: number;
}
export declare function refreshRedlockMultiSemaphore(clients: Redis[], key: string, limit: number, permits: number, options: Options): Promise<boolean>;
export {};
