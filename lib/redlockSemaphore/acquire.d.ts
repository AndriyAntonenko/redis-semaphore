import Redis from 'ioredis';
export interface Options {
    identifier: string;
    lockTimeout: number;
    acquireTimeout: number;
    acquireAttemptsLimit: number;
    retryInterval: number;
}
export declare function acquireRedlockSemaphore(clients: Redis[], key: string, limit: number, options: Options): Promise<boolean>;
