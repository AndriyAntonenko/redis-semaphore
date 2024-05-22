import Redis from 'ioredis';
export declare function refreshRedlockMutex(clients: Redis[], key: string, identifier: string, lockTimeout: number): Promise<boolean>;
