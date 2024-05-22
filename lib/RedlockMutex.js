"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const Lock_1 = require("./Lock");
const misc_1 = require("./misc");
const acquire_1 = require("./redlockMutex/acquire");
const refresh_1 = require("./redlockMutex/refresh");
const release_1 = require("./redlockMutex/release");
class RedlockMutex extends Lock_1.Lock {
    constructor(clients, key, options = misc_1.defaultTimeoutOptions) {
        super(options);
        this._kind = 'redlock-mutex';
        if (!clients || !Array.isArray(clients)) {
            throw new Error('"clients" array is required');
        }
        if (!clients.every(client => client instanceof ioredis_1.default)) {
            throw new Error('"client" must be instance of ioredis client');
        }
        if (!key) {
            throw new Error('"key" is required');
        }
        if (typeof key !== 'string') {
            throw new Error('"key" must be a string');
        }
        this._clients = clients;
        this._key = `mutex:${key}`;
    }
    async _refresh() {
        return await (0, refresh_1.refreshRedlockMutex)(this._clients, this._key, this._identifier, this._acquireOptions.lockTimeout);
    }
    async _acquire() {
        return await (0, acquire_1.acquireRedlockMutex)(this._clients, this._key, this._acquireOptions);
    }
    async _release() {
        await (0, release_1.releaseRedlockMutex)(this._clients, this._key, this._identifier);
    }
}
exports.default = RedlockMutex;
//# sourceMappingURL=RedlockMutex.js.map