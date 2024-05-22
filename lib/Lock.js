"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lock = void 0;
const debug_1 = __importDefault(require("debug"));
const crypto = __importStar(require("node:crypto"));
const LostLockError_1 = __importDefault(require("./errors/LostLockError"));
const TimeoutError_1 = __importDefault(require("./errors/TimeoutError"));
const misc_1 = require("./misc");
const REFRESH_INTERVAL_COEF = 0.8;
const debug = (0, debug_1.default)('redis-semaphore:instance');
class Lock {
    constructor({ lockTimeout = misc_1.defaultTimeoutOptions.lockTimeout, acquireTimeout = misc_1.defaultTimeoutOptions.acquireTimeout, acquireAttemptsLimit = misc_1.defaultTimeoutOptions.acquireAttemptsLimit, retryInterval = misc_1.defaultTimeoutOptions.retryInterval, refreshInterval = Math.round(lockTimeout * REFRESH_INTERVAL_COEF), onLockLost = misc_1.defaultOnLockLost, externallyAcquiredIdentifier, identifierSuffix, identifier, acquiredExternally } = misc_1.defaultTimeoutOptions) {
        this._refreshing = false;
        this._acquired = false;
        this._acquiredExternally = false;
        if (identifier !== undefined &&
            (!identifier || typeof identifier !== 'string')) {
            throw new Error('identifier must be not empty random string');
        }
        if (acquiredExternally && !identifier) {
            throw new Error('acquiredExternally=true meanless without custom identifier');
        }
        if (externallyAcquiredIdentifier && (identifier || acquiredExternally)) {
            throw new Error('Invalid usage. Use custom identifier and acquiredExternally: true');
        }
        this._identifier =
            identifier ||
                externallyAcquiredIdentifier ||
                this.getIdentifier(identifierSuffix);
        this._acquiredExternally =
            !!acquiredExternally || !!externallyAcquiredIdentifier;
        this._acquireOptions = {
            lockTimeout,
            acquireTimeout,
            acquireAttemptsLimit,
            retryInterval,
            identifier: this._identifier
        };
        this._refreshTimeInterval = refreshInterval;
        this._processRefresh = this._processRefresh.bind(this);
        this._onLockLost = onLockLost;
    }
    get identifier() {
        return this._identifier;
    }
    get isAcquired() {
        return this._acquired;
    }
    getIdentifier(identifierSuffix) {
        const uuid = crypto.randomUUID();
        return identifierSuffix ? `${uuid}-${identifierSuffix}` : uuid;
    }
    _startRefresh() {
        this._refreshInterval = setInterval(this._processRefresh, this._refreshTimeInterval);
        this._refreshInterval.unref();
    }
    stopRefresh() {
        if (this._refreshInterval) {
            debug(`clear refresh interval ${this._kind} (key: ${this._key}, identifier: ${this._identifier})`);
            clearInterval(this._refreshInterval);
        }
    }
    async _processRefresh() {
        if (this._refreshing) {
            debug(`already refreshing ${this._kind} (key: ${this._key}, identifier: ${this._identifier}) (skip)`);
            return;
        }
        this._refreshing = true;
        try {
            debug(`refresh ${this._kind} (key: ${this._key}, identifier: ${this._identifier})`);
            const refreshed = await this._refresh();
            if (!refreshed) {
                if (!this._acquired) {
                    debug(`refresh ${this._kind} (key: ${this._key}, identifier: ${this._identifier} failed, but lock was purposefully released`);
                    return;
                }
                this._acquired = false;
                this.stopRefresh();
                const lockLostError = new LostLockError_1.default(`Lost ${this._kind} for key ${this._key}`);
                this._onLockLost(lockLostError);
            }
        }
        finally {
            this._refreshing = false;
        }
    }
    async acquire() {
        debug(`acquire ${this._kind} (key: ${this._key})`);
        const acquired = await this.tryAcquire();
        if (!acquired) {
            throw new TimeoutError_1.default(`Acquire ${this._kind} ${this._key} timeout`);
        }
    }
    async tryAcquire() {
        debug(`tryAcquire ${this._kind} (key: ${this._key})`);
        const acquired = this._acquiredExternally
            ? await this._refresh()
            : await this._acquire();
        if (!acquired) {
            return false;
        }
        this._acquired = true;
        this._acquiredExternally = false;
        if (this._refreshTimeInterval > 0) {
            this._startRefresh();
        }
        return true;
    }
    async release() {
        debug(`release ${this._kind} (key: ${this._key}, identifier: ${this._identifier})`);
        if (this._refreshTimeInterval > 0) {
            this.stopRefresh();
        }
        if (this._acquired || this._acquiredExternally) {
            await this._release();
        }
        this._acquired = false;
        this._acquiredExternally = false;
    }
}
exports.Lock = Lock;
//# sourceMappingURL=Lock.js.map