import createDebug from 'debug';
const debug = createDebug('redis-semaphore:redlock-mutex:release');
export async function releaseRedlockSemaphore(clients, key, identifier) {
    debug(key, identifier);
    const promises = clients.map(client => client.zrem(key, identifier).catch(() => 0));
    const results = await Promise.all(promises);
    debug('results', results);
}
//# sourceMappingURL=release.js.map