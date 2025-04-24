import { GlobalSearchInput } from '@vendure/common/lib/generated-types';
import { InjectableStrategy, RequestContext } from '@vendure/core';

export interface GlobalIndexingStrategy extends InjectableStrategy {
    /**
     * Build the initial search index
     */
    buildIndex(ctx: RequestContext): Promise<boolean>;

    /**
     * Update the index with new data
     */
    updateIndex(ctx: RequestContext, entityType: string, entityId: string): Promise<boolean>;

    /**
     * Remove entities from the index
     */
    removeFromIndex(ctx: RequestContext, entityType: string, entityId: string): Promise<boolean>;

    /**
     * Rebuild the entire index
     */
    rebuildIndex(ctx: RequestContext): Promise<boolean>;
}
