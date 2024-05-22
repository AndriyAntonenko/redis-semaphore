"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseSemaphore = void 0;
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('redis-semaphore:semaphore:release');
async function releaseSemaphore(client, key, identifier) {
    debug(key, identifier);
    const result = await client.zrem(key, identifier);
    debug('result', typeof result, result);
}
exports.releaseSemaphore = releaseSemaphore;
//# sourceMappingURL=release.js.map