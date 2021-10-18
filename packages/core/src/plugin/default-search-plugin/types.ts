import { SearchInput as GeneratedSearchInput } from '@vendure/common/lib/generated-types';
import { ID, JsonCompatible } from '@vendure/common/lib/shared-types';

import { SerializedRequestContext } from '../../api/common/request-context';
import { Asset } from '../../entity/asset/asset.entity';

/**
 * @description
 * Options which configure the behaviour of the DefaultSearchPlugin
 *
 * @docsCategory DefaultSearchPlugin
 */
export interface DefaultSearchPluginInitOptions {
    /**
     * @description
     * If set to `true`, the stock status of a ProductVariant (isStock: Boolean) will
     * be exposed in the `search` query results. Enabling this option on an existing
     * Vendure installation will require a DB migration/synchronization.
     *
     * @default false.
     */
    indexStockStatus?: boolean;
    /**
     * @description
     * If set to `true`, updates to Products, ProductVariants and Collections will not immediately
     * trigger an update to the search index. Instead, all these changes will be buffered and will
     * only be run via a call to the `runPendingSearchIndexUpdates` mutation in the Admin API.
     *
     * This is very useful for installations with a large number of ProductVariants and/or
     * Collections, as the buffering allows better control over when these expensive jobs are run,
     * and also performs optimizations to minimize the amount of work that needs to be performed by
     * the worker.
     *
     * @since 1.3.0
     * @default false
     */
    bufferUpdates?: boolean;
}

/**
 * Because the `inStock` field is opt-in based on the `indexStockStatus` option,
 * it is not included by default in the generated types. Thus we manually augment
 * the generated type here.
 */
export interface SearchInput extends GeneratedSearchInput {
    inStock?: boolean;
}

export type ReindexMessageResponse = {
    total: number;
    completed: number;
    duration: number;
};

export type ReindexMessageData = {
    ctx: SerializedRequestContext;
};

export type UpdateProductMessageData = {
    ctx: SerializedRequestContext;
    productId: ID;
};

export type UpdateVariantMessageData = {
    ctx: SerializedRequestContext;
    variantIds: ID[];
};

export type UpdateVariantsByIdMessageData = {
    ctx: SerializedRequestContext;
    ids: ID[];
};

export type UpdateAssetMessageData = {
    ctx: SerializedRequestContext;
    asset: JsonCompatible<Required<Asset>>;
};

export type ProductChannelMessageData = {
    ctx: SerializedRequestContext;
    productId: ID;
    channelId: ID;
};

export type VariantChannelMessageData = {
    ctx: SerializedRequestContext;
    productVariantId: ID;
    channelId: ID;
};

type NamedJobData<Type extends string, MessageData> = { type: Type } & MessageData;

export type ReindexJobData = NamedJobData<'reindex', ReindexMessageData>;
export type UpdateProductJobData = NamedJobData<'update-product', UpdateProductMessageData>;
export type UpdateVariantsJobData = NamedJobData<'update-variants', UpdateVariantMessageData>;
export type DeleteProductJobData = NamedJobData<'delete-product', UpdateProductMessageData>;
export type DeleteVariantJobData = NamedJobData<'delete-variant', UpdateVariantMessageData>;
export type UpdateVariantsByIdJobData = NamedJobData<'update-variants-by-id', UpdateVariantsByIdMessageData>;
export type UpdateAssetJobData = NamedJobData<'update-asset', UpdateAssetMessageData>;
export type DeleteAssetJobData = NamedJobData<'delete-asset', UpdateAssetMessageData>;
export type AssignProductToChannelJobData = NamedJobData<
    'assign-product-to-channel',
    ProductChannelMessageData
>;
export type RemoveProductFromChannelJobData = NamedJobData<
    'remove-product-from-channel',
    ProductChannelMessageData
>;
export type AssignVariantToChannelJobData = NamedJobData<
    'assign-variant-to-channel',
    VariantChannelMessageData
>;
export type RemoveVariantFromChannelJobData = NamedJobData<
    'remove-variant-from-channel',
    VariantChannelMessageData
>;
export type UpdateIndexQueueJobData =
    | ReindexJobData
    | UpdateProductJobData
    | UpdateVariantsJobData
    | DeleteProductJobData
    | DeleteVariantJobData
    | UpdateVariantsByIdJobData
    | UpdateAssetJobData
    | DeleteAssetJobData
    | AssignProductToChannelJobData
    | RemoveProductFromChannelJobData
    | AssignVariantToChannelJobData
    | RemoveVariantFromChannelJobData;
