import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    Ctx,
    ID,
    InternalServerError,
    Logger,
    OrderService,
    PaymentMethod,
    RequestContext,
    TransactionalConnection,
} from '@vendure/core';

import { getGateway } from './braintree-common';
import { braintreePaymentMethodHandler } from './braintree-payment-method';
import { loggerCtx } from './constants';
import { PaymentMethodArgsHash } from './types';

@Resolver()
export class BraintreeResolver {
    constructor(private connection: TransactionalConnection, private orderService: OrderService) {}

    @Query()
    async generateBraintreeClientToken(@Ctx() ctx: RequestContext, @Args() { orderId }: { orderId: ID }) {
        const order = await this.orderService.findOne(ctx, orderId);
        if (order && order.customer) {
            const customerId = order.customer.id.toString();
            const args = await this.getPaymentMethodArgs(ctx);
            const gateway = getGateway(args);
            try {
                const result = await gateway.clientToken.generate({
                    customerId,
                });
                return result.clientToken;
            } catch (e) {
                Logger.error(e);
            }
        } else {
            throw new InternalServerError(`[${loggerCtx}] Could not find a Customer for the given Order`);
        }
    }

    private async getPaymentMethodArgs(ctx: RequestContext): Promise<PaymentMethodArgsHash> {
        const method = await this.connection.getRepository(ctx, PaymentMethod).findOne({
            where: {
                code: braintreePaymentMethodHandler.code,
            },
        });
        if (!method) {
            throw new InternalServerError(`[${loggerCtx}] Could not find Braintree PaymentMethod`);
        }
        return method.handler.args.reduce((hash, arg) => {
            return {
                ...hash,
                [arg.name]: arg.value,
            };
        }, {} as PaymentMethodArgsHash);
    }
}
