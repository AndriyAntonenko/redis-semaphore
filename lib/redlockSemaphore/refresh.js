"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshRedlockSemaphore = void 0;
const debug_1 = __importDefault(require("debug"));
const lua_1 = require("../semaphore/acquire/lua");
const lua_2 = require("../semaphore/refresh/lua");
const redlock_1 = require("../utils/redlock");
const debug = (0, debug_1.default)('redis-semaphore:redlock-semaphore:refresh');
async function refreshRedlockSemaphore(clients, key, limit, options) {
    const { identifier, lockTimeout } = options;
    const now = Date.now();
    debug(key, identifier, now);
    const quorum = (0, redlock_1.getQuorum)(clients.length);
    const promises = clients.map(client => (0, lua_2.refreshLua)(client, [key, limit, identifier, lockTimeout, now])
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
                .map(client => (0, lua_1.acquireLua)(client, [key, limit, identifier, lockTimeout, now])
                .then(result => +result)
                .catch(() => 0));
            const acquireResults = await Promise.all(promises);
            debug(key, identifier, 'acquire on failed nodes results', acquireResults);
        }
        return true;
    }
    else {
        const promises = clients.map(client => client.zrem(key, identifier).catch(() => 0));
        await Promise.all(promises);
        return false;
    }
}
exports.refreshRedlockSemaphore = refreshRedlockSemaphore;
//# sourceMappingURL=refresh.js.map