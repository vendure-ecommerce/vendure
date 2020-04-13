import { ID, JsonCompatible } from '@vendure/common/lib/shared-types';

import { SerializedRequestContext } from '../../api/common/request-context';
import { Asset } from '../../entity/asset/asset.entity';
import { WorkerMessage } from '../../worker/types';

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

export class ReindexMessage extends WorkerMessage<ReindexMessageData, ReindexMessageResponse> {
    static readonly pattern = 'Reindex';
}
export class UpdateVariantMessage extends WorkerMessage<UpdateVariantMessageData, boolean> {
    static readonly pattern = 'UpdateProduct';
}
export class UpdateProductMessage extends WorkerMessage<UpdateProductMessageData, boolean> {
    static readonly pattern = 'UpdateVariant';
}
export class DeleteVariantMessage extends WorkerMessage<UpdateVariantMessageData, boolean> {
    static readonly pattern = 'DeleteProduct';
}
export class DeleteProductMessage extends WorkerMessage<UpdateProductMessageData, boolean> {
    static readonly pattern = 'DeleteVariant';
}
export class UpdateVariantsByIdMessage extends WorkerMessage<
    UpdateVariantsByIdMessageData,
    ReindexMessageResponse
> {
    static readonly pattern = 'UpdateVariantsById';
}
export class AssignProductToChannelMessage extends WorkerMessage<ProductChannelMessageData, boolean> {
    static readonly pattern = 'AssignProductToChannel';
}
export class RemoveProductFromChannelMessage extends WorkerMessage<ProductChannelMessageData, boolean> {
    static readonly pattern = 'RemoveProductFromChannel';
}
export class UpdateAssetMessage extends WorkerMessage<UpdateAssetMessageData, boolean> {
    static readonly pattern = 'UpdateAsset';
}
export class DeleteAssetMessage extends WorkerMessage<UpdateAssetMessageData, boolean> {
    static readonly pattern = 'DeleteAsset';
}

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
    | RemoveProductFromChannelJobData;
