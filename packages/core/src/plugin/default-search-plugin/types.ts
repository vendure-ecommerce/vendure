import { ID, JsonCompatible } from '@vendure/common/lib/shared-types';

import { SerializedRequestContext } from '../../api/common/request-context';
import { Asset } from '../../entity/asset/asset.entity';

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
type UpdateProductJobData = NamedJobData<'update-product', UpdateProductMessageData>;
type UpdateVariantsJobData = NamedJobData<'update-variants', UpdateVariantMessageData>;
type DeleteProductJobData = NamedJobData<'delete-product', UpdateProductMessageData>;
type DeleteVariantJobData = NamedJobData<'delete-variant', UpdateVariantMessageData>;
type UpdateVariantsByIdJobData = NamedJobData<'update-variants-by-id', UpdateVariantsByIdMessageData>;
type UpdateAssetJobData = NamedJobData<'update-asset', UpdateAssetMessageData>;
type DeleteAssetJobData = NamedJobData<'delete-asset', UpdateAssetMessageData>;
type AssignProductToChannelJobData = NamedJobData<'assign-product-to-channel', ProductChannelMessageData>;
type RemoveProductFromChannelJobData = NamedJobData<'remove-product-from-channel', ProductChannelMessageData>;
type AssignVariantToChannelJobData = NamedJobData<'assign-variant-to-channel', VariantChannelMessageData>;
type RemoveVariantFromChannelJobData = NamedJobData<'remove-variant-from-channel', VariantChannelMessageData>;
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
