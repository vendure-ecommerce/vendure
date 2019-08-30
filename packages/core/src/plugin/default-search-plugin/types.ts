import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { WorkerMessage } from '../../worker/types';

export interface ReindexMessageResponse {
    total: number;
    completed: number;
    duration: number;
}

export type UpdateProductOrVariantMessageData = {
    ctx: RequestContext;
    productId?: ID;
    variantId?: ID;
};

export interface UpdateVariantsByIdMessageData {
    ctx: RequestContext;
    ids: ID[];
}

export class ReindexMessage extends WorkerMessage<{ ctx: RequestContext }, ReindexMessageResponse> {
    static readonly pattern = 'Reindex';
}
export class UpdateProductOrVariantMessage extends WorkerMessage<UpdateProductOrVariantMessageData, boolean> {
    static readonly pattern = 'UpdateProductOrVariant';
}
export class UpdateVariantsByIdMessage extends WorkerMessage<
    UpdateVariantsByIdMessageData,
    ReindexMessageResponse
> {
    static readonly pattern = 'UpdateVariantsById';
}
