import Redis from 'ioredis';
export interface Options {
    identifier: string;
    lockTimeout: number;
}
export declare function refreshSemaphore(client: Redis, key: string, limit: number, options: Options): Promise<boolean>;
