import { Inject } from '@nestjs/common';
import { Collection, ID, Logger, Product, ProductVariant } from '@vendure/core';
import fetch from 'node-fetch';

import { loggerCtx, STELLATE_PLUGIN_OPTIONS } from '../constants';
import { StellatePluginOptions } from '../types';

type CachedType =
    | 'Product'
    | 'ProductVariant'
    | 'Collection'
    | 'SearchResponse'
    | 'SearchResult'
    | 'SearchResponseCacheIdentifier'
    | string;

/**
 * @description
 * The StellateService is used to purge the Stellate cache when certain events occur.
 *
 * @docsCategory core plugins/StellatePlugin
 */
export class StellateService {
    private readonly purgeApiUrl: string;

    constructor(@Inject(STELLATE_PLUGIN_OPTIONS) private options: StellatePluginOptions) {
        this.purgeApiUrl = `https://admin.stellate.co/${options.serviceName}`;
    }

    /**
     * @description
     * Purges the cache for the given Products.
     */
    async purgeProducts(products: Product[]) {
        Logger.verbose(`Purging cache: Product(${products.map(p => p.id).join(', ')})`, loggerCtx);
        await this.purge(
            'Product',
            products.map(p => p.id),
        );
    }

    /**
     * @description
     * Purges the cache for the given ProductVariants.
     */
    async purgeProductVariants(productVariants: ProductVariant[]) {
        Logger.verbose(
            `Purging cache: ProductVariant(${productVariants.map(p => p.id).join(', ')})`,
            loggerCtx,
        );
        await this.purge(
            'ProductVariant',
            productVariants.map(p => p.id),
        );
    }

    /**
     * @description
     * Purges the cache for SearchResults which contain the given Products or ProductVariants.
     */
    async purgeSearchResults(items: Array<ProductVariant | Product>) {
        const productIds = items.map(item => (item instanceof Product ? item.id : item.productId));
        Logger.verbose(`Purging cache: SearchResult(${productIds.join(', ')})`, loggerCtx);
        await this.purge('SearchResult', productIds, 'productId');
    }

    /**
     * @description
     * Purges the entire cache for the given type.
     */
    async purgeAllOfType(type: CachedType) {
        Logger.verbose(`Purging cache: All ${type}s`, loggerCtx);
        await this.purge(type);
    }

    /**
     * @description
     * Purges the cache for the given Collections.
     */
    async purgeCollections(collections: Collection[]) {
        Logger.verbose(`Purging cache: Collection(${collections.map(c => c.id).join(', ')})`, loggerCtx);
        await this.purge(
            'Collection',
            collections.map(p => p.id),
        );
    }

    /**
     * @description
     * Purges the cache of SearchResults for the given Collections based on slug.
     */
    async purgeSearchResponseCacheIdentifiers(collections: Collection[]) {
        const slugs = collections.map(c => c.slug ?? c.translations?.[0]?.slug);
        if (slugs.length) {
            Logger.verbose(`Purging cache: SearchResponseCacheIdentifier(${slugs.join(', ')})`, loggerCtx);
            await this.purge('SearchResponseCacheIdentifier', slugs);
        }
    }

    /**
     * @description
     * Purges the cache for the given type and keys.
     */
    purge(type: CachedType, keys?: ID[], keyName = 'id') {
        const payload = {
            query: `
                mutation PurgeType($type: String!, $keyFields: [KeyFieldInput!]) {
                    _purgeType(type: $type, keyFields: $keyFields)
                }
            `,
            variables: {
                type,
                keyFields: keys?.filter(id => !!id).map(id => ({ name: keyName, value: id.toString() })),
            },
        };
        if (this.options.debugLogging === true) {
            const keyFieldsLength = payload.variables.keyFields?.length ?? 0;
            if (5 < keyFieldsLength) {
                payload.variables.keyFields = payload.variables.keyFields?.slice(0, 5);
            }
            Logger.debug('Purge arguments:\n' + JSON.stringify(payload.variables, null, 2), loggerCtx);
            if (5 < keyFieldsLength) {
                Logger.debug(`(A further ${keyFieldsLength - 5} keyFields truncated)`, loggerCtx);
            }
        }
        if (this.options.devMode === true) {
            // no-op
        } else {
            return fetch(this.purgeApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'stellate-token': this.options.apiToken,
                },
                body: JSON.stringify(payload),
                timeout: 5000,
            })
                .then(res => res.json())
                .then(json => {
                    if (json.data?._purgeType !== true) {
                        const errors = json.errors?.map((e: any) => e.message) as string[];
                        Logger.error(`Purge failed: ${errors.join(', ') ?? JSON.stringify(json)}`, loggerCtx);
                    }
                })
                .catch((err: any) => {
                    Logger.error(`Purge error: ${err.message as string}`, loggerCtx);
                });
        }
    }
}
