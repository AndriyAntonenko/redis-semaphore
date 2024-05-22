import { createHash } from 'crypto';
import createDebug from 'debug';
import { getConnectionName } from './index';
const debug = createDebug('redis-semaphore:eval');
function createSHA1(script) {
    return createHash('sha1').update(script, 'utf8').digest('hex');
}
function isNoScriptError(err) {
    return err.toString().indexOf('NOSCRIPT') !== -1;
}
export default function createEval(script, keysCount) {
    const sha1 = createSHA1(script);
    debug('creating script:', script, 'sha1:', sha1);
    return async function optimizedEval(client, args) {
        const connectionName = getConnectionName(client);
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
//# sourceMappingURL=createEval.js.map