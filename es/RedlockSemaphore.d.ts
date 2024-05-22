import Redis from 'ioredis';
import RedlockMutex from './RedlockMutex';
import { LockOptions } from './types';
export default class RedlockSemaphore extends RedlockMutex {
    protected _kind: string;
    protected _limit: number;
    constructor(clients: Redis[], key: string, limit: number, options?: LockOptions);
    protected _refresh(): Promise<boolean>;
    protected _acquire(): Promise<boolean>;
    protected _release(): Promise<void>;
}
