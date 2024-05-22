"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOnLockLost = exports.defaultTimeoutOptions = void 0;
exports.defaultTimeoutOptions = {
    lockTimeout: 10000,
    acquireTimeout: 10000,
    acquireAttemptsLimit: Number.POSITIVE_INFINITY,
    retryInterval: 10
};
function defaultOnLockLost(err) {
    throw err;
}
exports.defaultOnLockLost = defaultOnLockLost;
//# sourceMappingURL=misc.js.map