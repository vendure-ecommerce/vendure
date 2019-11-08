import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
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
