import Redis from 'ioredis';
export interface Options {
    identifier: string;
    lockTimeout: number;
    acquireTimeout: number;
    acquireAttemptsLimit: number;
    retryInterval: number;
}
export declare function acquireRedlockMultiSemaphore(clients: Redis[], key: string, limit: number, permits: number, options: Options): Promise<boolean>;
