"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseRedlockMultiSemaphore = void 0;
const debug_1 = __importDefault(require("debug"));
const lua_1 = require("../multiSemaphore/release/lua");
const debug = (0, debug_1.default)('redis-semaphore:redlock-mutex:release');
async function releaseRedlockMultiSemaphore(clients, key, permits, identifier) {
    debug(key, identifier);
    const promises = clients.map(client => (0, lua_1.releaseLua)(client, [key, permits, identifier]).catch(() => 0));
    const results = await Promise.all(promises);
    debug('results', results);
}
exports.releaseRedlockMultiSemaphore = releaseRedlockMultiSemaphore;
//# sourceMappingURL=release.js.map