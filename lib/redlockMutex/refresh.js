"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshRedlockMutex = void 0;
const debug_1 = __importDefault(require("debug"));
const refresh_1 = require("../mutex/refresh");
const release_1 = require("../mutex/release");
const redlock_1 = require("../utils/redlock");
const debug = (0, debug_1.default)('redis-semaphore:redlock-mutex:refresh');
async function refreshRedlockMutex(clients, key, identifier, lockTimeout) {
    debug(key, identifier);
    const quorum = (0, redlock_1.getQuorum)(clients.length);
    const promises = clients.map(client => (0, refresh_1.expireIfEqualLua)(client, [key, identifier, lockTimeout])
        .then(result => +result)
        .catch(() => 0));
    const results = await Promise.all(promises);
    debug('results', results);
    const refreshedCount = results.reduce(redlock_1.smartSum, 0);
    if (refreshedCount >= quorum) {
        debug(key, identifier, 'refreshed');
        if (refreshedCount < clients.length) {
            debug(key, identifier, 'try to acquire on failed nodes');
            const promises = results
                .reduce((failedClients, result, index) => {
                if (!result) {
                    failedClients.push(clients[index]);
                }
                return failedClients;
            }, [])
                .map(client => client
                .set(key, identifier, 'PX', lockTimeout, 'NX')
                .then(result => (result === 'OK' ? 1 : 0))
                .catch(() => 0));
            const acquireResults = await Promise.all(promises);
            debug(key, identifier, 'acquire on failed nodes results', acquireResults);
        }
        return true;
    }
    else {
        const promises = clients.map(client => (0, release_1.delIfEqualLua)(client, [key, identifier]).catch(() => 0));
        await Promise.all(promises);
        return false;
    }
}
exports.refreshRedlockMutex = refreshRedlockMutex;
//# sourceMappingURL=refresh.js.map