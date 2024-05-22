import Redis from 'ioredis';
export declare function releaseRedlockMutex(clients: Redis[], key: string, identifier: string): Promise<void>;
