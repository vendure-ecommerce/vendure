import { Injectable } from '@nestjs/common';
import { SearchReindexResponse } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../api/common/request-context';

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
            // tslint:disable-next-line:no-console
            console.warn(`The SearchService should be overridden by an appropriate search plugin.`);
        }
        return {
            indexedItemCount: 0,
            success: false,
            timeTaken: 0,
        };
    }
}
