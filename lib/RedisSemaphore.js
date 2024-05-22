"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RedisMutex_1 = __importDefault(require("./RedisMutex"));
const index_1 = require("./semaphore/acquire/index");
const index_2 = require("./semaphore/refresh/index");
const release_1 = require("./semaphore/release");
class RedisSemaphore extends RedisMutex_1.default {
    constructor(client, key, limit, options) {
        super(client, key, options);
        this._kind = 'semaphore';
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
        return await (0, index_2.refreshSemaphore)(this._client, this._key, this._limit, this._acquireOptions);
    }
    async _acquire() {
        return await (0, index_1.acquireSemaphore)(this._client, this._key, this._limit, this._acquireOptions);
    }
    async _release() {
        await (0, release_1.releaseSemaphore)(this._client, this._key, this._identifier);
    }
}
exports.default = RedisSemaphore;
//# sourceMappingURL=RedisSemaphore.js.map