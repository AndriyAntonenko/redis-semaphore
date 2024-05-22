"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartSum = exports.getQuorum = void 0;
function getQuorum(clientCount) {
    return Math.round((clientCount + 1) / 2);
}
exports.getQuorum = getQuorum;
function smartSum(count, zeroOrOne) {
    return count + zeroOrOne;
}
exports.smartSum = smartSum;
//# sourceMappingURL=redlock.js.map