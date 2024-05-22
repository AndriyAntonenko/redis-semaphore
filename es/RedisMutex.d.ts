import Redis from 'ioredis';
import { Lock } from './Lock';
import { LockOptions } from './types';
export default class RedisMutex extends Lock {
    protected _kind: string;
    protected _key: string;
    protected _client: Redis;
    constructor(client: Redis, key: string, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
