import Redis from 'ioredis';
import RedisSemaphore from './RedisSemaphore';
import { LockOptions } from './types';
export default class RedisMultiSemaphore extends RedisSemaphore {
    protected _kind: string;
    protected _permits: number;
    constructor(client: Redis, key: string, limit: number, permits: number, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
