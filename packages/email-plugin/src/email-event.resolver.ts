import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import {
    Ctx,
    Customer,
    CustomerService,
    DeepRequired,
    EventBus,
    Injector,
    Order,
    OrderService,
    Permission,
    RequestContext,
} from '@vendure/core';
import { Allow } from '@vendure/core/src';

import { EMAIL_PLUGIN_OPTIONS } from './constants';
import { EmailEventListener } from './event-listener';
import { EmailEvent, MutationResendEmailEventArgs } from './graphql/generated-admin-types';
import { EmailEventHandler } from './handler/event-handler';
import { ManualEmailEvent } from './manual-email-send-event';
import { InitializedEmailPluginOptions } from './types';

@Resolver()
export class EmailEventResolver {
    constructor(
        @Inject(EMAIL_PLUGIN_OPTIONS) protected options: InitializedEmailPluginOptions,
        private customerService: CustomerService,
        private orderService: OrderService,
        private moduleRef: ModuleRef,
        private eventBus: EventBus,
    ) {}

    @Query()
    @Allow(Permission.ReadOrder)
    async emailEventsForResend(@Ctx() ctx: RequestContext, @Args() args: any): Promise<EmailEvent[]> {
        let entity: Customer | Order;
        const { input } = args;

        if (input.entityType === 'Customer') {
            const customer = await this.customerService.findOne(ctx, input.entityId);
            if (!customer) return [];
            entity = customer;
        } else if (input.entityType === 'Order') {
            const order = await this.orderService.findOne(ctx, input.entityId);
            if (!order) return [];
            entity = order;
        }

        const handlers = this.options.handlers.filter(async handler => {
            if (!handler.resendOptions) {
                return false;
            }

            const isCustomerType = handler.resendOptions.entityType instanceof Customer;

            if (input.entityType === 'Customer' && !isCustomerType) return false;

            const isOrderType = handler.resendOptions.entityType instanceof Order;
            if (input.entityType === 'Order' && !isOrderType) {
                return false;
            }

            return handler.resendOptions.canResend(ctx, new Injector(this.moduleRef), entity);
        });
        const response: EmailEvent[] = [];
        for (const handler of handlers) {
            if (!handler.resendOptions) continue;

            response.push({
                type: handler.type,
                entityType: input.entityType,
                label: handler.resendOptions.label,
                description: handler.resendOptions?.description,
                operationDefinitions: handler.resendOptions?.operationDefinitions as
                    | EmailEvent['operationDefinitions']
                    | undefined,
            });
        }

        return response;
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.CreateOrder, Permission.DeleteOrder)
    async resendEmailEvent(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationResendEmailEventArgs,
    ): Promise<boolean> {
        const { input } = args;
        const handler = this.options.handlers.find(h => h.type === input.type);
        if (!handler) return false; // TODO add error
        if (!handler.resendOptions) return false; // TODO add error

        let entity: Customer | Order | undefined;
        if (input.entityType === 'Customer') entity = await this.customerService.findOne(ctx, input.entityId);
        else if (input.entityType === 'Order') entity = await this.orderService.findOne(ctx, input.entityId);

        if (!entity) return false; // TODO add error

        const canResend = await handler.resendOptions.canResend(ctx, new Injector(this.moduleRef), entity);
        if (!canResend) return false; // TODO add error

        const event = await handler.resendOptions?.createEvent(
            ctx,
            new Injector(this.moduleRef),
            entity,
            args.input.arguments,
        );

        await this.eventBus.publish(new ManualEmailEvent(handler, event));

        return true;
    }
}
