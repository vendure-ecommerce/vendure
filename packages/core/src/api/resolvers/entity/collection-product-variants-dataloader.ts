import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';

import { ProductVariantService } from '../../../service/services/product-variant.service';
import { RequestContext } from '../../common/request-context';

/**
 * DataLoader for batching collection product variant count queries.
 * Prevents N+1 queries when fetching productVariants.totalItems for multiple collections.
 */
@Injectable()
export class CollectionProductVariantsDataLoader {
    constructor(private productVariantService: ProductVariantService) {}

    /**
     * Creates a batch loader function that fetches variant counts for multiple collections
     */
    createLoader(ctx: RequestContext) {
        const loadCounts = async (collectionIds: readonly ID[]): Promise<number[]> => {
            const countMap = await this.productVariantService.getVariantCountsByCollectionIds(ctx, [
                ...collectionIds,
            ]);

            // Return counts in the same order as input IDs
            return collectionIds.map(id => countMap.get(id) ?? 0);
        };

        return loadCounts;
    }
}
