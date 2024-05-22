import createDebug from 'debug';
import { refreshLua } from './lua';
const debug = createDebug('redis-semaphore:semaphore:refresh');
export async function refreshSemaphore(client, key, limit, options) {
    const { identifier, lockTimeout } = options;
    const now = Date.now();
    debug(key, identifier, now);
    const result = await refreshLua(client, [
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
//# sourceMappingURL=index.js.map