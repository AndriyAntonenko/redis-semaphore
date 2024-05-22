import Redis from 'ioredis';
import createEval from './createEval';
export { createEval };
export declare function delay(ms: number): Promise<unknown>;
export declare function getConnectionName(client: Redis): string;
