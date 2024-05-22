"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSemaphore = void 0;
const debug_1 = __importDefault(require("debug"));
const lua_1 = require("./lua");
const debug = (0, debug_1.default)('redis-semaphore:semaphore:refresh');
async function refreshSemaphore(client, key, limit, options) {
    const { identifier, lockTimeout } = options;
    const now = Date.now();
    debug(key, identifier, now);
    const result = await (0, lua_1.refreshLua)(client, [
        key,
        limit,
        identifier,
        lockTimeout,
        now
    ]);
    debug('result', typeof result, result);
    // support options.stringNumbers
    return +result === 1;
}
exports.refreshSemaphore = refreshSemaphore;
//# sourceMappingURL=index.js.map