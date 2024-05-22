import createDebug from 'debug';
import { acquireLua } from '../semaphore/acquire/lua';
import { delay } from '../utils/index';
import { getQuorum, smartSum } from '../utils/redlock';
const debug = createDebug('redis-semaphore:redlock-semaphore:acquire');
export async function acquireRedlockSemaphore(clients, key, limit, options) {
    const { identifier, lockTimeout, acquireTimeout, acquireAttemptsLimit, retryInterval } = options;
    let attempt = 0;
    const end = Date.now() + acquireTimeout;
    const quorum = getQuorum(clients.length);
    let now;
    while ((now = Date.now()) < end && ++attempt <= acquireAttemptsLimit) {
        debug(key, identifier, 'attempt', attempt);
        const promises = clients.map(client => acquireLua(client, [key, limit, identifier, lockTimeout, now])
            .then(result => +result)
            .catch(() => 0));
        const results = await Promise.all(promises);
        if (results.reduce(smartSum, 0) >= quorum) {
            debug(key, identifier, 'acquired');
            return true;
        }
        else {
            const promises = clients.map(client => client.zrem(key, identifier).catch(() => 0));
            await Promise.all(promises);
            await delay(retryInterval);
        }
    }
    debug(key, identifier, 'timeout or reach limit');
    return false;
}
//# sourceMappingURL=acquire.js.map