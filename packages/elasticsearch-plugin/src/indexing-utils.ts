import { Client } from '@elastic/elasticsearch';
import { DeepRequired, ID, Logger } from '@vendure/core';

import { loggerCtx, PRODUCT_INDEX_NAME, VARIANT_INDEX_NAME } from './constants';
import { ElasticsearchOptions } from './options';
import { ProductIndexItem, VariantIndexItem } from './types';

export async function createIndices(
    client: Client,
    prefix: string,
    indexSettings: object,
    indexMappingProperties: object,
    primaryKeyType: 'increment' | 'uuid',
    mapAlias = true,
    aliasPostfix = ``,
) {
    const textWithKeyword = {
        type: 'text',
        fields: {
            keyword: {
                type: 'keyword',
                ignore_above: 256,
            },
        },
    };
    const keyword = { type: 'keyword' };
    const commonMappings = {
        sku: textWithKeyword,
        slug: textWithKeyword,
        productId: keyword,
        channelId: keyword,
        languageCode: keyword,
        productName: textWithKeyword,
        productVariantId: keyword,
        productVariantName: textWithKeyword,
        currencyCode: keyword,
        description: textWithKeyword,
        facetIds: keyword,
        facetValueIds: keyword,
        collectionIds: keyword,
        collectionSlugs: keyword,
        channelIds: keyword,
        enabled: { type: 'boolean' },
        productAssetId: keyword,
        productPreview: textWithKeyword,
        productPreviewFocalPoint: { type: 'object' },
        productVariantAssetId: keyword,
        productVariantPreview: textWithKeyword,
        productVariantPreviewFocalPoint: { type: 'object' },
    };

    const productMappings: { [prop in keyof ProductIndexItem]: any } = {
        ...commonMappings,
        priceMin: { type: 'long' },
        priceMax: { type: 'long' },
        priceWithTaxMin: { type: 'long' },
        priceWithTaxMax: { type: 'long' },
        ...indexMappingProperties,
    };

    const variantMappings: { [prop in keyof VariantIndexItem]: any } = {
        ...commonMappings,
        price: { type: 'long' },
        priceWithTax: { type: 'long' },
        ...indexMappingProperties,
    };

    const unixtimestampPostfix = new Date().getTime();

    const createIndex = async (mappings: { [prop in keyof any]: any }, index: string, alias: string) => {
        if (mapAlias) {
            await client.indices.create({
                index,
                body: {
                    mappings: {
                        properties: mappings,
                    },
                    settings: indexSettings,
                },
            });
            await client.indices.putAlias({
                index,
                name: alias,
            });
            Logger.verbose(`Created index "${index}"`, loggerCtx);
        } else {
            await client.indices.create({
                index: alias,
                body: {
                    mappings: {
                        properties: mappings,
                    },
                    settings: indexSettings,
                },
            });
            Logger.verbose(`Created index "${alias}"`, loggerCtx);
        }
    };

    try {
        const index = prefix + VARIANT_INDEX_NAME + `${unixtimestampPostfix}`;
        const alias = prefix + VARIANT_INDEX_NAME + aliasPostfix;

        await createIndex(variantMappings, index, alias);
    } catch (e) {
        Logger.error(JSON.stringify(e, null, 2), loggerCtx);
    }

    try {
        const index = prefix + PRODUCT_INDEX_NAME + `${unixtimestampPostfix}`;
        const alias = prefix + PRODUCT_INDEX_NAME + aliasPostfix;

        await createIndex(productMappings, index, alias);
    } catch (e) {
        Logger.error(JSON.stringify(e, null, 2), loggerCtx);
    }
}

export async function deleteIndices(client: Client, prefix: string) {
    try {
        const index = await getIndexNameByAlias(client, prefix + VARIANT_INDEX_NAME);
        await client.indices.delete({ index });
        Logger.verbose(`Deleted index "${index}"`, loggerCtx);
    } catch (e) {
        Logger.error(e, loggerCtx);
    }
    try {
        const index = await getIndexNameByAlias(client, prefix + PRODUCT_INDEX_NAME);
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

export function getClient(
    options: Required<ElasticsearchOptions> | DeepRequired<ElasticsearchOptions>,
): Client {
    const { host, port } = options;
    const node = options.clientOptions?.node ?? `${host}:${port}`;
    return new Client({
        node,
        // `any` cast is there due to a strange error "Property '[Symbol.iterator]' is missing in type... URLSearchParams"
        // which looks like possibly a TS/definitions bug.
        ...(options.clientOptions as any),
    });
}

export async function getIndexNameByAlias(client: Client, aliasName: string) {
    const aliasExist = await client.indices.existsAlias({ name: aliasName });
    if (aliasExist.body) {
        const alias = await client.indices.getAlias({
            name: aliasName,
        });
        return Object.keys(alias.body)[0];
    } else {
        return aliasName;
    }
}
