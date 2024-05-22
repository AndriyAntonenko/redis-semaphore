import Redis from 'ioredis';
import createEval from './createEval';
export { createEval };
export async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}
export function getConnectionName(client) {
    return client instanceof Redis && client.options.connectionName
        ? `<${client.options.connectionName}>`
        : '<unknown client>';
}
//# sourceMappingURL=index.js.map