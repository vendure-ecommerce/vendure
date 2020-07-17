import { ID } from '@vendure/common/lib/shared-types';

import { SerializedRequestContext } from '../../api/common/request-context';
import { WorkerMessage } from '../../worker/types';

export interface ProcessCollectionsResponse {
    total: number;
    completed: number;
    duration: number;
    collectionId: ID;
    affectedVariantIds: ID[];
}

export class ApplyCollectionFiltersMessage extends WorkerMessage<
    { collectionIds: ID[] },
    ProcessCollectionsResponse
> {
    static readonly pattern = 'ApplyCollectionFilters';
}

export type ApplyCollectionFiltersJobData = { ctx: SerializedRequestContext; collectionIds: ID[] };
