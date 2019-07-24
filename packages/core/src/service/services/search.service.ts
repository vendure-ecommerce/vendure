import { Injectable } from '@nestjs/common';
import { JobInfo, JobState } from '@vendure/common/lib/generated-types';

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
    private override: Pick<SearchService, 'reindex'> | undefined;

    /**
     * Adopt a concrete search service implementation to pass through the
     * calls to.
     */
    adopt(override: Pick<SearchService, 'reindex'>) {
        this.override = override;
    }

    async reindex(ctx: RequestContext): Promise<JobInfo> {
        if (this.override) {
            return this.override.reindex(ctx);
        }
        if (!process.env.CI) {
            Logger.warn(`The SearchService should be overridden by an appropriate search plugin.`);
        }
        return {
            id: 'error',
            name: '',
            state: JobState.FAILED,
            progress: 0,
        };
    }
}
