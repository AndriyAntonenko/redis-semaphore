import { createEval } from '../../utils/index';
export const refreshLua = createEval(`
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local identifier = ARGV[2]
  local lockTimeout = tonumber(ARGV[3])
  local now = tonumber(ARGV[4])
  local expiredTimestamp = now - lockTimeout

  redis.call('zremrangebyscore', key, '-inf', expiredTimestamp)

  if redis.call('zscore', key, identifier) then
    redis.call('zadd', key, now, identifier)
    redis.call('pexpire', key, lockTimeout)
    return 1
  else
    return 0
  end`, 1);
//# sourceMappingURL=lua.js.map