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
    async reindex(ctx: RequestContext): Promise<JobInfo> {
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
