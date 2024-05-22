import Redis from 'ioredis';
import RedisMutex from './RedisMutex';
import { LockOptions } from './types';
export default class RedisSemaphore extends RedisMutex {
    protected _kind: string;
    protected _limit: number;
    constructor(client: Redis, key: string, limit: number, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
