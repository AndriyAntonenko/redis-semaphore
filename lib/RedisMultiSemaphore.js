"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./multiSemaphore/acquire/index");
const index_2 = require("./multiSemaphore/refresh/index");
const index_3 = require("./multiSemaphore/release/index");
const RedisSemaphore_1 = __importDefault(require("./RedisSemaphore"));
class RedisMultiSemaphore extends RedisSemaphore_1.default {
    constructor(client, key, limit, permits, options) {
        super(client, key, limit, options);
        this._kind = 'multi-semaphore';
        if (!permits) {
            throw new Error('"permits" is required');
        }
        if (typeof permits !== 'number') {
            throw new Error('"permits" must be a number');
        }
        this._permits = permits;
    }
    async _refresh() {
        return await (0, index_2.refreshSemaphore)(this._client, this._key, this._limit, this._permits, this._acquireOptions);
    }
    async _acquire() {
        return await (0, index_1.acquireSemaphore)(this._client, this._key, this._limit, this._permits, this._acquireOptions);
    }
    async _release() {
        await (0, index_3.releaseSemaphore)(this._client, this._key, this._permits, this._identifier);
    }
}
exports.default = RedisMultiSemaphore;
//# sourceMappingURL=RedisMultiSemaphore.js.map