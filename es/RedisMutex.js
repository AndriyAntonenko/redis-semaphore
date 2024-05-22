import { Lock } from './Lock';
import { acquireMutex } from './mutex/acquire';
import { refreshMutex } from './mutex/refresh';
import { releaseMutex } from './mutex/release';
export default class RedisMutex extends Lock {
    constructor(client, key, options) {
        super(options);
        this._kind = 'mutex';
        if (!client) {
            throw new Error('"client" is required');
        }
        if (!key) {
            throw new Error('"key" is required');
        }
        if (typeof key !== 'string') {
            throw new Error('"key" must be a string');
        }
        this._client = client;
        this._key = `mutex:${key}`;
    }
    async _refresh() {
        return await refreshMutex(this._client, this._key, this._identifier, this._acquireOptions.lockTimeout);
    }
    async _acquire() {
        return await acquireMutex(this._client, this._key, this._acquireOptions);
    }
    async _release() {
        await releaseMutex(this._client, this._key, this._identifier);
    }
}
//# sourceMappingURL=RedisMutex.js.map