import Redis from 'ioredis';
export interface Options {
    identifier: string;
    lockTimeout: number;
    now: number;
}
export declare function releaseSemaphore(client: Redis, key: string, permits: number, identifier: string): Promise<void>;
