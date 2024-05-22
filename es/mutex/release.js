import createDebug from 'debug';
import { createEval } from '../utils/index';
const debug = createDebug('redis-semaphore:mutex:release');
export const delIfEqualLua = createEval(`
  local key = KEYS[1]
  local identifier = ARGV[1]

  if redis.call('get', key) == identifier then
    return redis.call('del', key)
  end

  return 0
  `, 1);
export async function releaseMutex(client, key, identifier) {
    debug(key, identifier);
    const result = await delIfEqualLua(client, [key, identifier]);
    debug('result', typeof result, result);
}
//# sourceMappingURL=release.js.map