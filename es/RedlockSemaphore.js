import RedlockMutex from './RedlockMutex';
import { acquireRedlockSemaphore } from './redlockSemaphore/acquire';
import { refreshRedlockSemaphore } from './redlockSemaphore/refresh';
import { releaseRedlockSemaphore } from './redlockSemaphore/release';
export default class RedlockSemaphore extends RedlockMutex {
    constructor(clients, key, limit, options) {
        super(clients, key, options);
        this._kind = 'redlock-semaphore';
        if (!limit) {
            throw new Error('"limit" is required');
        }
        if (typeof limit !== 'number') {
            throw new Error('"limit" must be a number');
        }
        this._key = `semaphore:${key}`;
        this._limit = limit;
    }
    async _refresh() {
        return await refreshRedlockSemaphore(this._clients, this._key, this._limit, this._acquireOptions);
    }
    async _acquire() {
        return await acquireRedlockSemaphore(this._clients, this._key, this._limit, this._acquireOptions);
    }
    async _release() {
        await releaseRedlockSemaphore(this._clients, this._key, this._identifier);
    }
}
//# sourceMappingURL=RedlockSemaphore.js.map