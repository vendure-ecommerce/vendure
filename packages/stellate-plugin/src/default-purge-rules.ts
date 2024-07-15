/* eslint-disable @typescript-eslint/no-floating-promises */
import {
    CollectionEvent,
    CollectionModificationEvent,
    Logger,
    ProductChannelEvent,
    ProductEvent,
    ProductVariantChannelEvent,
    ProductVariantEvent,
    StockMovementEvent,
    TaxRateEvent,
} from '@vendure/core';

import { loggerCtx } from './constants';
import { PurgeRule } from './purge-rule';

export const purgeProductsOnProductEvent = new PurgeRule({
    eventType: ProductEvent,
    handler: ({ events, stellateService }) => {
        const products = events.map(e => e.product);
        stellateService.purgeProducts(products);
        stellateService.purgeSearchResults(products);
    },
});

export const purgeProductVariantsOnProductVariantEvent = new PurgeRule({
    eventType: ProductVariantEvent,
    handler: ({ events, stellateService }) => {
        const variants = events.map(e => e.variants).flat();
        stellateService.purgeProductVariants(variants);
        stellateService.purgeSearchResults(variants);
    },
});

export const purgeProductsOnChannelEvent = new PurgeRule({
    eventType: ProductChannelEvent,
    handler: ({ events, stellateService }) => {
        const products = events.map(e => e.product);
        stellateService.purgeProducts(products);
        stellateService.purgeSearchResults(products);
    },
});

export const purgeProductVariantsOnChannelEvent = new PurgeRule({
    eventType: ProductVariantChannelEvent,
    handler: ({ events, stellateService }) => {
        const variants = events.map(e => e.productVariant);
        stellateService.purgeProductVariants(variants);
        stellateService.purgeSearchResults(variants);
    },
});

export const purgeProductVariantsOnStockMovementEvent = new PurgeRule({
    eventType: StockMovementEvent,
    handler: ({ events, stellateService }) => {
        const variants = events.map(e => e.stockMovements.map(m => m.productVariant)).flat();
        stellateService.purgeProductVariants(variants);
        stellateService.purgeSearchResults(variants);
    },
});

export const purgeCollectionsOnCollectionModificationEvent = new PurgeRule({
    eventType: CollectionModificationEvent,
    handler: ({ events, stellateService }) => {
        const collectionsToPurge = events.filter(e => e.productVariantIds.length).map(e => e.collection);
        Logger.debug(
            `purgeCollectionsOnCollectionModificationEvent, collectionsToPurge: ${collectionsToPurge
                .map(c => c.id)
                .join(', ')}`,
            loggerCtx,
        );
        if (collectionsToPurge.length) {
            stellateService.purgeCollections(collectionsToPurge);
            stellateService.purgeSearchResponseCacheIdentifiers(collectionsToPurge);
        }
    },
});

export const purgeCollectionsOnCollectionEvent = new PurgeRule({
    eventType: CollectionEvent,
    handler: ({ events, stellateService }) => {
        const collections = events.map(e => e.entity);
        stellateService.purgeCollections(collections);
    },
});

export const purgeAllOnTaxRateEvent = new PurgeRule({
    eventType: TaxRateEvent,
    handler: ({ stellateService }) => {
        stellateService.purgeAllOfType('ProductVariant');
        stellateService.purgeAllOfType('Product');
        stellateService.purgeAllOfType('SearchResponse');
    },
});

export const defaultPurgeRules = [
    purgeAllOnTaxRateEvent,
    purgeCollectionsOnCollectionEvent,
    purgeCollectionsOnCollectionModificationEvent,
    purgeProductsOnChannelEvent,
    purgeProductsOnProductEvent,
    purgeProductVariantsOnChannelEvent,
    purgeProductVariantsOnProductVariantEvent,
    purgeProductVariantsOnStockMovementEvent,
];
