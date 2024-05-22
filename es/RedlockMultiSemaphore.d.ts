import Redis from 'ioredis';
import RedlockSemaphore from './RedlockSemaphore';
import { LockOptions } from './types';
export default class RedlockMultiSemaphore extends RedlockSemaphore {
    protected _kind: string;
    protected _permits: number;
    constructor(clients: Redis[], key: string, limit: number, permits: number, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
