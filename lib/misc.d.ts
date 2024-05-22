import LostLockError from '../src/errors/LostLockError';
export declare const defaultTimeoutOptions: {
    lockTimeout: number;
    acquireTimeout: number;
    acquireAttemptsLimit: number;
    retryInterval: number;
};
export declare function defaultOnLockLost(err: LostLockError): void;
