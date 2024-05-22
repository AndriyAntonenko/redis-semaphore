"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const acquire_1 = require("./redlockMultiSemaphore/acquire");
const refresh_1 = require("./redlockMultiSemaphore/refresh");
const release_1 = require("./redlockMultiSemaphore/release");
const RedlockSemaphore_1 = __importDefault(require("./RedlockSemaphore"));
class RedlockMultiSemaphore extends RedlockSemaphore_1.default {
    constructor(clients, key, limit, permits, options) {
        super(clients, key, limit, options);
        this._kind = 'redlock-multi-semaphore';
        if (!permits) {
            throw new Error('"permits" is required');
        }
        if (typeof permits !== 'number') {
            throw new Error('"permits" must be a number');
        }
        this._permits = permits;
    }
    async _refresh() {
        return await (0, refresh_1.refreshRedlockMultiSemaphore)(this._clients, this._key, this._limit, this._permits, this._acquireOptions);
    }
    async _acquire() {
        return await (0, acquire_1.acquireRedlockMultiSemaphore)(this._clients, this._key, this._limit, this._permits, this._acquireOptions);
    }
    async _release() {
        await (0, release_1.releaseRedlockMultiSemaphore)(this._clients, this._key, this._permits, this._identifier);
    }
}
exports.default = RedlockMultiSemaphore;
//# sourceMappingURL=RedlockMultiSemaphore.js.map