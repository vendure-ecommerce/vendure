import { Injectable } from '@nestjs/common';
import { RequestContext, SessionService, TransactionalConnection, Product, Session } from '@vendure/core';

@Injectable()
export class SessionCustomFieldsTestService {
    constructor(
        private connection: TransactionalConnection,
        private sessionService: SessionService,
    ) {}

    /**
     * Test method - WRONG WAY (will not load Session custom field relations)
     */
    exampleMethod(ctx: RequestContext) {
        return this.connection.getRepository(ctx, Session).find({
            relations: {
                customFields: {
                    example: true,
                },
            },
            take: 2,
        });
    }

    /**
     * Test method - CORRECT WAY (will load Session custom field relations)
     */
    exampleMethodFixed(ctx: RequestContext) {
        return this.sessionService.findSessionsWithRelations(ctx, {
            relations: ['customFields.example'],
            take: 2,
        });
    }

    /**
     * Test method for Product (works normally)
     */
    exampleMethod2(ctx: RequestContext) {
        return this.connection.getRepository(ctx, Product).find({
            relations: {
                customFields: {
                    example: true,
                },
            },
            take: 2,
        });
    }
}