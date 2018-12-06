import { Column, Entity } from 'typeorm';

import { ConfigArg } from '../../../../shared/generated-types';
import { DeepPartial } from '../../../../shared/shared-types';
import { UserInputError } from '../../common/error/errors';
import { getConfig } from '../../config/vendure-config';
import { VendureEntity } from '../base/base.entity';
import { Order } from '../order/order.entity';
import { Payment, PaymentMetadata } from '../payment/payment.entity';

@Entity()
export class PaymentMethod extends VendureEntity {
    constructor(input?: DeepPartial<PaymentMethod>) {
        super(input);
    }

    @Column() code: string;

    @Column() enabled: boolean;

    @Column('simple-json') configArgs: ConfigArg[];

    async createPayment(order: Order, metadata: PaymentMetadata) {
        const handler = getConfig().paymentOptions.paymentMethodHandlers.find(h => h.code === this.code);
        if (!handler) {
            throw new UserInputError(`error.no-payment-handler-with-code`, { code: this.code });
        }
        const result = await handler.createPayment(order, this.configArgs, metadata || {});
        return new Payment(result);
    }
}
