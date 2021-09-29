import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { InternalServerError } from '../../../common/error/errors';
import { Order } from '../../../entity/order/order.entity';
import { OrderService } from '../../services/order.service';
import { SessionService } from '../../services/session.service';

@Injectable()
export class ActiveOrderService {
    constructor(private sessionService: SessionService, private orderService: OrderService) {}

    /**
     * @description
     * Gets the active Order object from the current Session. Optionally can create a new Order if
     * no active Order exists.
     *
     * Intended to be used at the Resolver layer for those resolvers that depend upon an active Order
     * being present.
     */
    async getOrderFromContext(ctx: RequestContext): Promise<Order | undefined>;
    async getOrderFromContext(ctx: RequestContext, createIfNotExists: true): Promise<Order>;
    async getOrderFromContext(ctx: RequestContext, createIfNotExists = false): Promise<Order | undefined> {
        if (!ctx.session) {
            throw new InternalServerError(`error.no-active-session`);
        }
        let order = ctx.session.activeOrderId
            ? await this.orderService.findOne(ctx, ctx.session.activeOrderId)
            : undefined;
        if (order && order.active === false) {
            // edge case where an inactive order may not have been
            // removed from the session, i.e. the regular process was interrupted
            await this.sessionService.unsetActiveOrder(ctx, ctx.session);
            order = undefined;
        }
        if (!order) {
            if (ctx.activeUserId) {
                order = await this.orderService.getActiveOrderForUser(ctx, ctx.activeUserId);
            }

            if (!order && createIfNotExists) {
                order = await this.orderService.create(ctx, ctx.activeUserId);
            }

            if (order) {
                await this.sessionService.setActiveOrder(ctx, ctx.session, order);
            }
        }
        return order || undefined;
    }
}
