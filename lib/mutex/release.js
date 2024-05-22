"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseMutex = exports.delIfEqualLua = void 0;
const debug_1 = __importDefault(require("debug"));
const index_1 = require("../utils/index");
const debug = (0, debug_1.default)('redis-semaphore:mutex:release');
exports.delIfEqualLua = (0, index_1.createEval)(`
  local key = KEYS[1]
  local identifier = ARGV[1]

  if redis.call('get', key) == identifier then
    return redis.call('del', key)
  end

  return 0
  `, 1);
async function releaseMutex(client, key, identifier) {
    debug(key, identifier);
    const result = await (0, exports.delIfEqualLua)(client, [key, identifier]);
    debug('result', typeof result, result);
}
exports.releaseMutex = releaseMutex;
//# sourceMappingURL=release.js.map