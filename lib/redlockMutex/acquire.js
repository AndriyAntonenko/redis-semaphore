"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquireRedlockMutex = void 0;
const debug_1 = __importDefault(require("debug"));
const release_1 = require("../mutex/release");
const index_1 = require("../utils/index");
const redlock_1 = require("../utils/redlock");
const debug = (0, debug_1.default)('redis-semaphore:redlock-mutex:acquire');
async function acquireRedlockMutex(clients, key, options) {
    const { identifier, lockTimeout, acquireTimeout, acquireAttemptsLimit, retryInterval } = options;
    let attempt = 0;
    const end = Date.now() + acquireTimeout;
    const quorum = (0, redlock_1.getQuorum)(clients.length);
    while (Date.now() < end && ++attempt <= acquireAttemptsLimit) {
        debug(key, identifier, 'attempt', attempt);
        const promises = clients.map(client => client
            .set(key, identifier, 'PX', lockTimeout, 'NX')
            .then(result => (result === 'OK' ? 1 : 0))
            .catch(() => 0));
        const results = await Promise.all(promises);
        if (results.reduce(redlock_1.smartSum, 0) >= quorum) {
            debug(key, identifier, 'acquired');
            return true;
        }
        else {
            const promises = clients.map(client => (0, release_1.delIfEqualLua)(client, [key, identifier]).catch(() => 0));
            await Promise.all(promises);
            await (0, index_1.delay)(retryInterval);
        }
    }
    debug(key, identifier, 'timeout or reach limit');
    return false;
}
exports.acquireRedlockMutex = acquireRedlockMutex;
//# sourceMappingURL=acquire.js.map