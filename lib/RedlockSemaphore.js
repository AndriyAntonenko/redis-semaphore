"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RedlockMutex_1 = __importDefault(require("./RedlockMutex"));
const acquire_1 = require("./redlockSemaphore/acquire");
const refresh_1 = require("./redlockSemaphore/refresh");
const release_1 = require("./redlockSemaphore/release");
class RedlockSemaphore extends RedlockMutex_1.default {
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
        return await (0, refresh_1.refreshRedlockSemaphore)(this._clients, this._key, this._limit, this._acquireOptions);
    }
    async _acquire() {
        return await (0, acquire_1.acquireRedlockSemaphore)(this._clients, this._key, this._limit, this._acquireOptions);
    }
    async _release() {
        await (0, release_1.releaseRedlockSemaphore)(this._clients, this._key, this._identifier);
    }
}
exports.default = RedlockSemaphore;
//# sourceMappingURL=RedlockSemaphore.js.map