"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquireMutex = void 0;
const debug_1 = __importDefault(require("debug"));
const index_1 = require("../utils/index");
const debug = (0, debug_1.default)('redis-semaphore:mutex:acquire');
async function acquireMutex(client, key, options) {
    const { identifier, lockTimeout, acquireTimeout, acquireAttemptsLimit, retryInterval } = options;
    let attempt = 0;
    const end = Date.now() + acquireTimeout;
    while (Date.now() < end && ++attempt <= acquireAttemptsLimit) {
        debug(key, identifier, 'attempt', attempt);
        const result = await client.set(key, identifier, 'PX', lockTimeout, 'NX');
        debug('result', typeof result, result);
        if (result === 'OK') {
            debug(key, identifier, 'acquired');
            return true;
        }
        else {
            await (0, index_1.delay)(retryInterval);
        }
    }
    debug(key, identifier, 'timeout or reach limit');
    return false;
}
exports.acquireMutex = acquireMutex;
//# sourceMappingURL=acquire.js.map