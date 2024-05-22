"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lock_1 = require("./Lock");
const acquire_1 = require("./mutex/acquire");
const refresh_1 = require("./mutex/refresh");
const release_1 = require("./mutex/release");
class RedisMutex extends Lock_1.Lock {
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
        return await (0, refresh_1.refreshMutex)(this._client, this._key, this._identifier, this._acquireOptions.lockTimeout);
    }
    async _acquire() {
        return await (0, acquire_1.acquireMutex)(this._client, this._key, this._acquireOptions);
    }
    async _release() {
        await (0, release_1.releaseMutex)(this._client, this._key, this._identifier);
    }
}
exports.default = RedisMutex;
//# sourceMappingURL=RedisMutex.js.map