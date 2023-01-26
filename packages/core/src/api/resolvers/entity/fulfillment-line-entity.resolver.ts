import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { TransactionalConnection } from '../../../connection/index';
import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { FulfillmentLine, OrderLine } from '../../../entity/index';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('FulfillmentLine')
export class FulfillmentLineEntityResolver {
    constructor(private connection: TransactionalConnection) {}

    @ResolveField()
    async orderLine(@Ctx() ctx: RequestContext, @Parent() fulfillmentLine: FulfillmentLine) {
        return this.connection.getRepository(ctx, OrderLine).findOne(fulfillmentLine.orderLineId);
    }

    @ResolveField()
    async fulfillment(@Ctx() ctx: RequestContext, @Parent() fulfillmentLine: FulfillmentLine) {
        return this.connection.getRepository(ctx, Fulfillment).findOne(fulfillmentLine.fulfillmentId);
    }
}
