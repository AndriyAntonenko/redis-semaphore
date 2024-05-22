import createDebug from 'debug';
import { delay } from '../../utils/index';
import { acquireLua } from './lua';
const debug = createDebug('redis-semaphore:semaphore:acquire');
export async function acquireSemaphore(client, key, limit, options) {
    const { identifier, lockTimeout, acquireTimeout, acquireAttemptsLimit, retryInterval } = options;
    let attempt = 0;
    const end = Date.now() + acquireTimeout;
    let now;
    while ((now = Date.now()) < end && ++attempt <= acquireAttemptsLimit) {
        debug(key, identifier, limit, lockTimeout, 'attempt', attempt);
        const result = await acquireLua(client, [
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
            await delay(retryInterval);
        }
    }
    debug(key, identifier, limit, lockTimeout, 'timeout or reach limit');
    return false;
}
//# sourceMappingURL=index.js.map