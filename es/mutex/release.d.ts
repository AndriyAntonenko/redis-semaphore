import Redis from 'ioredis';
export declare const delIfEqualLua: (client: Redis, args: [string, string]) => Promise<0 | 1>;
export declare function releaseMutex(client: Redis, key: string, identifier: string): Promise<void>;
