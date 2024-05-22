"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseLua = void 0;
const index_1 = require("../../utils/index");
exports.releaseLua = (0, index_1.createEval)(`
  local key = KEYS[1]
  local permits = tonumber(ARGV[1])
  local identifier = ARGV[2]
  local args = {}

  for i=0, permits - 1 do
    table.insert(args, identifier .. '_' .. i)
  end

  return redis.call('zrem', key, unpack(args))
`, 1);
//# sourceMappingURL=lua.js.map