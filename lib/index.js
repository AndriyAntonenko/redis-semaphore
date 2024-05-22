"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = exports.LostLockError = exports.RedlockMultiSemaphore = exports.RedlockSemaphore = exports.RedlockMutex = exports.MultiSemaphore = exports.Semaphore = exports.Mutex = exports.defaultTimeoutOptions = void 0;
const RedisMultiSemaphore_1 = __importDefault(require("./RedisMultiSemaphore"));
exports.MultiSemaphore = RedisMultiSemaphore_1.default;
const RedisMutex_1 = __importDefault(require("./RedisMutex"));
exports.Mutex = RedisMutex_1.default;
const RedisSemaphore_1 = __importDefault(require("./RedisSemaphore"));
exports.Semaphore = RedisSemaphore_1.default;
const RedlockMultiSemaphore_1 = __importDefault(require("./RedlockMultiSemaphore"));
exports.RedlockMultiSemaphore = RedlockMultiSemaphore_1.default;
const RedlockMutex_1 = __importDefault(require("./RedlockMutex"));
exports.RedlockMutex = RedlockMutex_1.default;
const RedlockSemaphore_1 = __importDefault(require("./RedlockSemaphore"));
exports.RedlockSemaphore = RedlockSemaphore_1.default;
const LostLockError_1 = __importDefault(require("./errors/LostLockError"));
exports.LostLockError = LostLockError_1.default;
const TimeoutError_1 = __importDefault(require("./errors/TimeoutError"));
exports.TimeoutError = TimeoutError_1.default;
var misc_1 = require("./misc");
Object.defineProperty(exports, "defaultTimeoutOptions", { enumerable: true, get: function () { return misc_1.defaultTimeoutOptions; } });
//# sourceMappingURL=index.js.map