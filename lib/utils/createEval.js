"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const debug_1 = __importDefault(require("debug"));
const index_1 = require("./index");
const debug = (0, debug_1.default)('redis-semaphore:eval');
function createSHA1(script) {
    return (0, crypto_1.createHash)('sha1').update(script, 'utf8').digest('hex');
}
function isNoScriptError(err) {
    return err.toString().indexOf('NOSCRIPT') !== -1;
}
function createEval(script, keysCount) {
    const sha1 = createSHA1(script);
    debug('creating script:', script, 'sha1:', sha1);
    return async function optimizedEval(client, args) {
        const connectionName = (0, index_1.getConnectionName)(client);
        const evalSHAArgs = [sha1, keysCount, ...args];
        debug(connectionName, sha1, 'attempt, args:', evalSHAArgs);
        try {
            return (await client.evalsha(sha1, keysCount, ...args));
        }
        catch (err) {
            if (isNoScriptError(err)) {
                const evalArgs = [script, keysCount, ...args];
                debug(connectionName, sha1, 'fallback to eval, args:', evalArgs);
                return (await client.eval(script, keysCount, ...args));
            }
            else {
                throw err;
            }
        }
    };
}
exports.default = createEval;
//# sourceMappingURL=createEval.js.map