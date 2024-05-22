import Redis from 'ioredis';
export interface Options {
    identifier: string;
    lockTimeout: number;
    acquireTimeout: number;
    acquireAttemptsLimit: number;
    retryInterval: number;
}
export declare function acquireMutex(client: Redis, key: string, options: Options): Promise<boolean>;
