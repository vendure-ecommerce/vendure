import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { SENTRY_PLUGIN_OPTIONS, SENTRY_TRANSACTION_KEY } from './constants';
import { SentryService } from './sentry.service';
import { SentryPluginOptions } from './types';

@Injectable()
export class SentryContextMiddleware implements NestMiddleware {
    constructor(
        @Inject(SENTRY_PLUGIN_OPTIONS) private options: SentryPluginOptions,
        private sentryService: SentryService,
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        if (this.options.enableTracing) {
            const transaction = this.sentryService.startTransaction({
                op: 'resolver',
                name: `GraphQLTransaction`,
            });
            req[SENTRY_TRANSACTION_KEY] = transaction;
        }
        next();
    }
}
