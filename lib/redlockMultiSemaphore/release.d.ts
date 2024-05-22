import Redis from 'ioredis';
export declare function releaseRedlockMultiSemaphore(clients: Redis[], key: string, permits: number, identifier: string): Promise<void>;
