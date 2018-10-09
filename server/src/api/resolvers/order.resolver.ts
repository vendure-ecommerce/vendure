import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AddItemToOrderMutationArgs,
    AdjustItemQuantityMutationArgs,
    OrderQueryArgs,
    OrdersQueryArgs,
    Permission,
    RemoveItemFromOrderMutationArgs,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Order } from '../../entity/order/order.entity';
import { I18nError } from '../../i18n/i18n-error';
import { AuthService } from '../../service/providers/auth.service';
import { OrderService } from '../../service/providers/order.service';
import { Allow } from '../common/auth-guard';
import { Decode } from '../common/id-interceptor';
import { RequestContext } from '../common/request-context';
import { Ctx } from '../common/request-context.decorator';

@Resolver('Order')
export class OrderResolver {
    constructor(private orderService: OrderService, private authService: AuthService) {}

    @Query()
    @Allow(Permission.ReadOrder)
    orders(@Ctx() ctx: RequestContext, @Args() args: OrdersQueryArgs): Promise<PaginatedList<Order>> {
        return this.orderService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadOrder, Permission.Owner)
    async order(@Ctx() ctx: RequestContext, @Args() args: OrderQueryArgs): Promise<Order | undefined> {
        const order = await this.orderService.findOne(ctx, args.id);
        if (order && ctx.authorizedAsOwnerOnly) {
            if (ctx.session && ctx.session.activeOrder && ctx.session.activeOrder.id === order.id) {
                return order;
            } else {
                return;
            }
        }
        return order;
    }

    @Query()
    @Allow(Permission.Owner)
    async activeOrder(@Ctx() ctx: RequestContext): Promise<Order | undefined> {
        if (ctx.authorizedAsOwnerOnly) {
            if (ctx.session && ctx.session.activeOrder && ctx.session.activeOrder.id) {
                const order = await this.orderService.findOne(ctx, ctx.session.activeOrder.id);
                return order;
            } else {
                return;
            }
        }
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    @Decode('productVariantId')
    async addItemToOrder(
        @Ctx() ctx: RequestContext,
        @Args() args: AddItemToOrderMutationArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx);
        return this.orderService.addItemToOrder(ctx, order.id, args.productVariantId, args.quantity);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    @Decode('orderItemId')
    async adjustItemQuantity(
        @Ctx() ctx: RequestContext,
        @Args() args: AdjustItemQuantityMutationArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx);
        return this.orderService.adjustItemQuantity(ctx, order.id, args.orderItemId, args.quantity);
    }

    @Mutation()
    @Allow(Permission.UpdateOrder, Permission.Owner)
    @Decode('orderItemId')
    async removeItemFromOrder(
        @Ctx() ctx: RequestContext,
        @Args() args: RemoveItemFromOrderMutationArgs,
    ): Promise<Order> {
        const order = await this.getOrderFromContext(ctx);
        return this.orderService.removeItemFromOrder(ctx, order.id, args.orderItemId);
    }

    private async getOrderFromContext(ctx: RequestContext): Promise<Order> {
        if (!ctx.session) {
            throw new I18nError(`error.no-active-session`);
        }
        let order = ctx.session.activeOrder;
        if (!order) {
            order = await this.orderService.create();
            await this.authService.setActiveOrder(ctx.session, order);
        }
        return order;
    }
}
