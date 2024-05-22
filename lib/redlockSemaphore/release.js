"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseRedlockSemaphore = void 0;
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('redis-semaphore:redlock-mutex:release');
async function releaseRedlockSemaphore(clients, key, identifier) {
    debug(key, identifier);
    const promises = clients.map(client => client.zrem(key, identifier).catch(() => 0));
    const results = await Promise.all(promises);
    debug('results', results);
}
exports.releaseRedlockSemaphore = releaseRedlockSemaphore;
//# sourceMappingURL=release.js.map