"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshMutex = exports.expireIfEqualLua = void 0;
const debug_1 = __importDefault(require("debug"));
const index_1 = require("../utils/index");
const debug = (0, debug_1.default)('redis-semaphore:mutex:refresh');
exports.expireIfEqualLua = (0, index_1.createEval)(`
  local key = KEYS[1]
  local identifier = ARGV[1]
  local lockTimeout = ARGV[2]

  local value = redis.call('get', key)

  if value == identifier then
    redis.call('pexpire', key, lockTimeout)
    return 1
  end

  return 0
  `, 1);
async function refreshMutex(client, key, identifier, lockTimeout) {
    debug(key, identifier);
    const result = await (0, exports.expireIfEqualLua)(client, [key, identifier, lockTimeout]);
    debug('result', typeof result, result);
    // support options.stringNumbers
    return +result === 1;
}
exports.refreshMutex = refreshMutex;
//# sourceMappingURL=refresh.js.map