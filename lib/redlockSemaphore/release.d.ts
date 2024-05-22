import Redis from 'ioredis';
export declare function releaseRedlockSemaphore(clients: Redis[], key: string, identifier: string): Promise<void>;
