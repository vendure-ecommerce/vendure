import { Injectable } from '@nestjs/common';

import { LanguageCode, SearchReindexResponse } from '../../../../shared/generated-types';

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
    async reindex(languageCode: LanguageCode): Promise<SearchReindexResponse> {
        // tslint:disable-next-line:no-console
        console.error(`The SearchService should be overridden by an appropriate search plugin.`);
        return {
            indexedItemCount: 0,
            success: false,
            timeTaken: 0,
        };
    }
}
