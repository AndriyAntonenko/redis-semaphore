"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquireSemaphore = void 0;
const debug_1 = __importDefault(require("debug"));
const index_1 = require("../../utils/index");
const lua_1 = require("./lua");
const debug = (0, debug_1.default)('redis-semaphore:semaphore:acquire');
async function acquireSemaphore(client, key, limit, options) {
    const { identifier, lockTimeout, acquireTimeout, acquireAttemptsLimit, retryInterval } = options;
    let attempt = 0;
    const end = Date.now() + acquireTimeout;
    let now;
    while ((now = Date.now()) < end && ++attempt <= acquireAttemptsLimit) {
        debug(key, identifier, limit, lockTimeout, 'attempt', attempt);
        const result = await (0, lua_1.acquireLua)(client, [
            key,
            limit,
            identifier,
            lockTimeout,
            now
        ]);
        debug(key, 'result', typeof result, result);
        // support options.stringNumbers
        if (+result === 1) {
            debug(key, identifier, 'acquired');
            return true;
        }
        else {
            await (0, index_1.delay)(retryInterval);
        }
    }
    debug(key, identifier, limit, lockTimeout, 'timeout or reach limit');
    return false;
}
exports.acquireSemaphore = acquireSemaphore;
//# sourceMappingURL=index.js.map