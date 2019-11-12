import { Client } from '@elastic/elasticsearch';
import { ID, Logger } from '@vendure/core';

import { loggerCtx, PRODUCT_INDEX_NAME, VARIANT_INDEX_NAME } from './constants';

export async function createIndices(client: Client, prefix: string) {
    try {
        const index = prefix + VARIANT_INDEX_NAME;
        await client.indices.create({ index });
        Logger.verbose(`Created index "${index}"`, loggerCtx);
    } catch (e) {
        Logger.error(JSON.stringify(e, null, 2), loggerCtx);
    }
    try {
        const index = prefix + PRODUCT_INDEX_NAME;
        await client.indices.create({ index });
        Logger.verbose(`Created index "${index}"`, loggerCtx);
    } catch (e) {
        Logger.error(JSON.stringify(e, null, 2), loggerCtx);
    }
}

export async function deleteIndices(client: Client, prefix: string) {
    try {
        const index = prefix + VARIANT_INDEX_NAME;
        await client.indices.delete({ index });
        Logger.verbose(`Deleted index "${index}"`, loggerCtx);
    } catch (e) {
        Logger.error(e, loggerCtx);
    }
    try {
        const index = prefix + PRODUCT_INDEX_NAME;
        await client.indices.delete({ index });
        Logger.verbose(`Deleted index "${index}"`, loggerCtx);
    } catch (e) {
        Logger.error(e, loggerCtx);
    }
}

export async function deleteByChannel(client: Client, prefix: string, channelId: ID) {
    try {
        const index = prefix + VARIANT_INDEX_NAME;
        await client.deleteByQuery({
            index,
            body: {
                query: {
                    match: { channelId },
                },
            },
        });
        Logger.verbose(`Deleted index "${index} for channel "${channelId}"`, loggerCtx);
    } catch (e) {
        Logger.error(e, loggerCtx);
    }
    try {
        const index = prefix + PRODUCT_INDEX_NAME;
        await client.deleteByQuery({
            index,
            body: {
                query: {
                    match: { channelId },
                },
            },
        });
        Logger.verbose(`Deleted index "${index}" for channel "${channelId}"`, loggerCtx);
    } catch (e) {
        Logger.error(e, loggerCtx);
    }
}
