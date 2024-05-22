"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshLua = void 0;
const index_1 = require("../../utils/index");
exports.refreshLua = (0, index_1.createEval)(`
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