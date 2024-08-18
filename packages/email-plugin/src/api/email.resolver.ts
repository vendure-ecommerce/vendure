import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import {
    Ctx,
    Customer,
    CustomerService,
    EventBus,
    ID,
    Injector,
    LanguageCode,
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
        @Args()
        input: {
            entityType: string;
            entityId: ID;
            languageCode?: LanguageCode;
        }, // TODO change input types
    ) {
        let entity: Customer | Order;

        if (input.entityType === 'Customer') {
            const customer = await this.customerService.findOne(ctx, input.entityId);
            if (!customer) return false; // TODO add error
            entity = customer;
        } else if (input.entityType === 'Order') {
            const order = await this.orderService.findOne(ctx, input.entityId);
            if (!order) {
                return false; // TODO add error
            }
            entity = order;
        }

        const handlers = this.options.handlers.filter(async handler => {
            if (!handler.uiOptions) {
                return false; // TODO add error
            }

            const isCustomerType =
                input.entityType === 'Customer' && handler.uiOptions.entityType instanceof Customer;
            const isOrderType = input.entityType === 'Order' && handler.uiOptions.entityType instanceof Order;

            if (!isCustomerType && !isOrderType) {
                return false; // TODO add error
            }

            // Note: Since `filter` is async, ensure the final implementation handles async properly
            return handler.uiOptions.filter(ctx, new Injector(this.moduleRef), entity, input.languageCode);
        });
        return handlers; // TODO change to right response type, right now this is done only for PR review
    }

    @Mutation()
    async resendEmailEvent(
        @Ctx() ctx: RequestContext,
        @Args()
        input: {
            type: string;
            entityType: string;
            entityId: ID;
            languageCode?: LanguageCode;
        }, // TODO change input types
    ) {
        const handler = this.options.handlers.find(h => h.type === input.type);
        if (!handler) return false; // TODO add error
        if (!handler.uiOptions) return false; // TODO add error

        let entity: Customer | Order | undefined;
        if (input.entityType === 'Customer') entity = await this.customerService.findOne(ctx, input.entityId);
        else if (input.entityType === 'Order') entity = await this.orderService.findOne(ctx, input.entityId);

        if (!entity) return false; // TODO add error

        if (!handler.uiOptions.filter(ctx, new Injector(this.moduleRef), entity, input.languageCode))
            return false; // TODO add error
        const event = await handler.uiOptions?.handler(
            ctx,
            new Injector(this.moduleRef),
            entity,
            input.languageCode,
        );

        await this.eventBus.publish(new ManualEmailEvent(handler, event));

        return true;
    }
}
