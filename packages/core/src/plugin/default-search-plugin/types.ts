import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { Asset } from '../../entity/asset/asset.entity';
import { WorkerMessage } from '../../worker/types';

export interface ReindexMessageResponse {
    total: number;
    completed: number;
    duration: number;
}

export type UpdateProductMessageData = {
    ctx: RequestContext;
    productId: ID;
};

export type UpdateVariantMessageData = {
    ctx: RequestContext;
    variantIds: ID[];
};

export interface UpdateVariantsByIdMessageData {
    ctx: RequestContext;
    ids: ID[];
}
export interface UpdateAssetMessageData {
    ctx: RequestContext;
    asset: Asset;
}

export interface ProductChannelMessageData {
    ctx: RequestContext;
    productId: ID;
    channelId: ID;
}

export class ReindexMessage extends WorkerMessage<{ ctx: RequestContext }, ReindexMessageResponse> {
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
