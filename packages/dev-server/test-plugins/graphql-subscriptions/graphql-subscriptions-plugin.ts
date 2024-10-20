import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import {
    Ctx,
    ID,
    Order,
    OrderService,
    PluginCommonModule,
    RequestContext,
    TransactionalConnection,
    VendurePlugin,
} from '@vendure/core';
import { PubSub } from 'graphql-subscriptions';
import { gql } from 'graphql-tag';
import { Inject } from '@nestjs/common';

@Resolver()
class OrderStateResolver {
    constructor(
        @Inject('PUB_SUB') private readonly pubSub: PubSub,
        private readonly db: TransactionalConnection,
    ) {}

    @Subscription(() => Order, {
        filter: (payload, variables) => {
            return payload.orderStateUpdated.id === variables.orderId;
        },
    })
    async orderStateUpdated(@Args('orderId') orderId: ID) {
        return this.pubSub.asyncIterator('orderStateUpdated');
    }

    @Mutation(() => Order)
    async triggerOrderStateUpdated(@Ctx() ctx: RequestContext, @Args('orderId') orderId: ID) {
        const order = await this.db.getEntityOrThrow(ctx, Order, orderId);

        return this.pubSub.publish('orderStateUpdated', { orderStateUpdated: order });
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    shopApiExtensions: {
        schema: gql`
            extend type Subscription {
                orderStateUpdated(orderId: ID!): Order!
            }

            extend type Mutation {
                triggerOrderStateUpdated(orderId: ID!): Order
            }
        `,
        resolvers: [OrderStateResolver],
    },
    configuration: config => {
        return config;
    },
})
export class GraphqlSubscriptionsPlugin {}
