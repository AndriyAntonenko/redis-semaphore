"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseRedlockMutex = void 0;
const debug_1 = __importDefault(require("debug"));
const release_1 = require("../mutex/release");
const debug = (0, debug_1.default)('redis-semaphore:redlock-mutex:release');
async function releaseRedlockMutex(clients, key, identifier) {
    debug(key, identifier);
    const promises = clients.map(client => (0, release_1.delIfEqualLua)(client, [key, identifier]).catch(() => 0));
    const results = await Promise.all(promises);
    debug('results', results);
}
exports.releaseRedlockMutex = releaseRedlockMutex;
//# sourceMappingURL=release.js.map