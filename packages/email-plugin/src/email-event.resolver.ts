import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import {
    EmailEvent,
    MutationResendEmailEventArgs,
    QueryEmailEventsForResendArgs,
} from '@vendure/common/lib/generated-types';
import { Ctx, EventBus, ID, Injector, RequestContext, TransactionalConnection } from '@vendure/core';

import { EMAIL_PLUGIN_OPTIONS } from './constants';
import { ConfigurableEmailEventHandler } from './email-event-configurable-operation';
import { EmailEventResend } from './email-event-resend-event';
import { EmailEventHandler } from './handler/event-handler';
import { InitializedEmailPluginOptions } from './types';

@Resolver()
export class EmailEventResolver {
    constructor(
        @Inject(EMAIL_PLUGIN_OPTIONS) protected options: InitializedEmailPluginOptions,
        private moduleRef: ModuleRef,
        private eventBus: EventBus,
        private connection: TransactionalConnection,
    ) {}

    private async findEntity(ctx: RequestContext, entityType: string, entityId: ID) {
        const entityMetadata = this.connection.rawConnection.entityMetadatas;

        const entityClass = entityMetadata.find(
            meta => meta.name.toLowerCase() === entityType.toLowerCase(),
        )?.target;
        if (!entityClass) throw new Error(`Invalid entity type: ${entityType}`);

        return this.connection.getRepository(ctx, entityClass).findOne({ where: { id: entityId } });
    }

    @Query()
    async emailEventsForResend(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryEmailEventsForResendArgs,
    ): Promise<EmailEvent[]> {
        const { entityType, entityId } = args;

        const entity = await this.findEntity(ctx, entityType, entityId);
        if (!entity) return [];

        const handlers = await Promise.all(
            this.options.handlers.map(async handler => {
                if (!handler.resendOptions) return null;

                const isRequestedType = entity instanceof handler.resendOptions.entityType;
                if (!isRequestedType) return null;

                const canResend = await handler.resendOptions.canResend(
                    ctx,
                    new Injector(this.moduleRef),
                    entity,
                );
                return canResend ? handler : null;
            }),
        );

        const validHandlers = handlers.filter(handler => handler !== null) as EmailEventHandler[];

        const response: EmailEvent[] = [];
        for (const handler of validHandlers) {
            if (!handler.resendOptions) continue;

            const configurableEmailEventHandler = new ConfigurableEmailEventHandler(handler);

            response.push({
                type: handler.type,
                entityType,
                label: handler.resendOptions.label,
                description: handler.resendOptions?.description,
                operationDefinitions: configurableEmailEventHandler.configurableOperationDef?.toGraphQlType(
                    ctx as any,
                ),
            });
        }
        return response;
    }

    @Mutation()
    async resendEmailEvent(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationResendEmailEventArgs,
    ): Promise<boolean> {
        const { input } = args;
        const handler = this.options.handlers.find(h => h.type === input.type);
        if (!handler) return false; // TODO add error
        if (!handler.resendOptions) return false; // TODO add error

        const entity = await this.findEntity(ctx, input.entityType, input.entityId);
        if (!entity) return false; // TODO add error

        const isRequestedType = entity instanceof handler.resendOptions.entityType;
        if (!isRequestedType) return false; // TODO add error

        const canResend = await handler.resendOptions.canResend(ctx, new Injector(this.moduleRef), entity);
        if (!canResend) return false; // TODO add error

        const configurableEmailEventHandler = new ConfigurableEmailEventHandler(handler);
        const event = await handler.resendOptions.createEvent(
            ctx,
            new Injector(this.moduleRef),
            entity,
            configurableEmailEventHandler.argsArrayToHash(input.operation?.arguments || []),
        );

        await this.eventBus.publish(new EmailEventResend(handler, event));

        return true;
    }
}
