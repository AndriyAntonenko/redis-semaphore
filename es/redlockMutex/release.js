import createDebug from 'debug';
import { delIfEqualLua } from '../mutex/release';
const debug = createDebug('redis-semaphore:redlock-mutex:release');
export async function releaseRedlockMutex(clients, key, identifier) {
    debug(key, identifier);
    const promises = clients.map(client => delIfEqualLua(client, [key, identifier]).catch(() => 0));
    const results = await Promise.all(promises);
    debug('results', results);
}
//# sourceMappingURL=release.js.map