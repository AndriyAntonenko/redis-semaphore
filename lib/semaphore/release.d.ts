import Redis from 'ioredis';
export declare function releaseSemaphore(client: Redis, key: string, identifier: string): Promise<void>;
