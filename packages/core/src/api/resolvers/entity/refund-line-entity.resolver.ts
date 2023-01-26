import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { TransactionalConnection } from '../../../connection/index';
import { OrderLine, Refund, RefundLine } from '../../../entity/index';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('RefundLine')
export class RefundLineEntityResolver {
    constructor(private connection: TransactionalConnection) {}

    @ResolveField()
    async orderLine(@Ctx() ctx: RequestContext, @Parent() refundLine: RefundLine): Promise<OrderLine> {
        return await this.connection.getEntityOrThrow(ctx, OrderLine, refundLine.orderLineId);
    }

    @ResolveField()
    async refund(@Ctx() ctx: RequestContext, @Parent() refundLine: RefundLine): Promise<Refund> {
        return this.connection.getEntityOrThrow(ctx, Refund, refundLine.refundId);
    }
}
