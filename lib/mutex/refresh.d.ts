import Redis from 'ioredis';
export declare const expireIfEqualLua: (client: Redis, args: [string, string, number]) => Promise<0 | 1>;
export declare function refreshMutex(client: Redis, key: string, identifier: string, lockTimeout: number): Promise<boolean>;
