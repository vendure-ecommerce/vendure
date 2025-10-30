import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
    Allow,
    Ctx,
    OrderService,
    Permission,
    PluginCommonModule,
    RequestContext,
    RequestContextService,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';

import { StripePlugin } from '../../src/stripe';
import { StripeService } from '../../src/stripe/stripe.service';

@Resolver()
export class CustomStripeResolver {
    constructor(
        private stripeService: StripeService,
        private orderService: OrderService,
        private requestContextService: RequestContextService,
    ) {}

    @Mutation()
    @Allow(Permission.Owner)
    async createCustomStripePaymentIntent(
        @Ctx() ctx: RequestContext,
        @Args() args: { orderCode: string; channelToken: string },
    ): Promise<string> {
        // By the orderCode we find the order where we assume additional payments are required.
        // If the order is not in the request's channel context, we can use other means to lookup the order.
        const order = await this.orderService.findOneByCode(ctx, args.orderCode);
        // The stripe webhook handler expects: channelToken, orderId, orderCode and languageCode
        // We can hijack those details, to support cross-channel payments and additional "non-active" order payments
        const customCtx = await this.requestContextService.create({
            apiType: 'shop',
            channelOrToken: args.channelToken,
            req: ctx.req,
        });
        if (!order) {
            throw new Error('No order');
        }
        return this.stripeService.createPaymentIntent(customCtx, order);
    }
}

@VendurePlugin({
    imports: [PluginCommonModule, StripePlugin],
    shopApiExtensions: {
        schema: gql`
            extend type Mutation {
                createCustomStripePaymentIntent(orderCode: String, channelToken: String): String!
            }
        `,
        resolvers: [CustomStripeResolver],
    },
})
export class StripeServiceExportTestPlugin {}
