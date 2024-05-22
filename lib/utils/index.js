"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionName = exports.delay = exports.createEval = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const createEval_1 = __importDefault(require("./createEval"));
exports.createEval = createEval_1.default;
async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}
exports.delay = delay;
function getConnectionName(client) {
    return client instanceof ioredis_1.default && client.options.connectionName
        ? `<${client.options.connectionName}>`
        : '<unknown client>';
}
exports.getConnectionName = getConnectionName;
//# sourceMappingURL=index.js.map