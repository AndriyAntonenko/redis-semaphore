"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseSemaphore = void 0;
const debug_1 = __importDefault(require("debug"));
const lua_1 = require("./lua");
const debug = (0, debug_1.default)('redis-semaphore:multi-semaphore:release');
async function releaseSemaphore(client, key, permits, identifier) {
    debug(key, identifier, permits);
    const result = await (0, lua_1.releaseLua)(client, [key, permits, identifier]);
    debug('result', typeof result, result);
}
exports.releaseSemaphore = releaseSemaphore;
//# sourceMappingURL=index.js.map