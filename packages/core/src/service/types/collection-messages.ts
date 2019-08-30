import { ID } from '@vendure/common/lib/shared-types';

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
