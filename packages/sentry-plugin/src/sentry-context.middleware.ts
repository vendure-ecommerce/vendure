import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { SENTRY_START_SPAN_INACTIVE_KEY, SENTRY_PLUGIN_OPTIONS } from './constants';
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
            req[SENTRY_START_SPAN_INACTIVE_KEY] = this.sentryService.startInactiveSpan.bind(
                this.sentryService,
            );
        }
        next();
    }
}
