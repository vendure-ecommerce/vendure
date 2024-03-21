import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Permission, UserInputError } from '@vendure/core';

import { SentryService } from '../sentry.service';
import { ErrorTestService } from './error-test.service';

declare const a: number;

@Resolver()
export class SentryAdminTestResolver {
    constructor(private sentryService: SentryService, private errorTestService: ErrorTestService) {}

    @Allow(Permission.SuperAdmin)
    @Mutation()
    async createTestError(@Args() args: { errorType: string }) {
        switch (args.errorType) {
            case 'UNCAUGHT_ERROR':
                return a / 10;
            case 'THROWN_ERROR':
                throw new UserInputError('SentryPlugin Test Error');
            case 'CAPTURED_ERROR':
                this.sentryService.captureException(new Error('SentryPlugin Direct error'));
                return true;
            case 'CAPTURED_MESSAGE':
                this.sentryService.captureMessage('Captured message');
                return true;
            case 'DATABASE_ERROR':
                await this.errorTestService.createDatabaseError();
                return true;
        }
    }
}
