import Redis from 'ioredis';
export default function createEval<Args extends Array<number | string>, Result>(script: string, keysCount: number): (client: Redis, args: Args) => Promise<Result>;
