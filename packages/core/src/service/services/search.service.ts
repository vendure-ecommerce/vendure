import { Injectable } from '@nestjs/common';
import { SearchReindexResponse } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../api/common/request-context';
import { Logger } from '../../config/logger/vendure-logger';

/**
 * This service should be overridden by a VendurePlugin which implements search.
 *
 * ```
 * defineProviders(): Provider[] {
 *     return [
 *         { provide: SearchService, useClass: MySearchService },
 *     ];
 * }
 * ```
 */
@Injectable()
export class SearchService {
    async reindex(ctx: RequestContext): Promise<SearchReindexResponse> {
        if (!process.env.CI) {
            Logger.warn(`The SearchService should be overridden by an appropriate search plugin.`);
        }
        return {
            indexedItemCount: 0,
            success: false,
            timeTaken: 0,
        };
    }
}
