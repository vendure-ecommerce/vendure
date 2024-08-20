import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import {
    EmailEvent,
    MutationResendEmailEventArgs,
    QueryAvailableEmailEventsForResendArgs,
} from '@vendure/common/lib/generated-types';
import {
    Ctx,
    Customer,
    CustomerService,
    EventBus,
    Injector,
    Order,
    OrderService,
    RequestContext,
} from '@vendure/core';

import { EMAIL_PLUGIN_OPTIONS } from '../constants';
import { ManualEmailEvent } from '../manual-email-send-event';
import { InitializedEmailPluginOptions } from '../types';

@Resolver()
export class EmailResolver {
    constructor(
        @Inject(EMAIL_PLUGIN_OPTIONS) protected options: InitializedEmailPluginOptions,
        private customerService: CustomerService,
        private orderService: OrderService,
        private moduleRef: ModuleRef,
        private eventBus: EventBus,
    ) {}

    @Query()
    async availableEmailEventsForResend(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryAvailableEmailEventsForResendArgs,
    ): Promise<EmailEvent[]> {
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
        return handlers.map(handler => ({
            type: handler.type,
            entityType: input.entityType,
            // label: handler.resendOptions!.label,
            // description: handler.resendOptions?.description,
        }));
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

        let entity: Customer | Order | undefined;
        if (input.entityType === 'Customer') entity = await this.customerService.findOne(ctx, input.entityId);
        else if (input.entityType === 'Order') entity = await this.orderService.findOne(ctx, input.entityId);

        if (!entity) return false; // TODO add error

        const canResend = await handler.resendOptions.canResend(ctx, new Injector(this.moduleRef), entity);
        if (!canResend) return false; // TODO add error

        const event = await handler.resendOptions?.createEvent(ctx, new Injector(this.moduleRef), entity);

        await this.eventBus.publish(new ManualEmailEvent(handler, event));

        return true;
    }
}
