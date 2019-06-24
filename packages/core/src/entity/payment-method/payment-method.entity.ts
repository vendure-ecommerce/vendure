import { ConfigArg } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity } from 'typeorm';

import { UserInputError } from '../../common/error/errors';
import { getConfig } from '../../config/config-helpers';
import { VendureEntity } from '../base/base.entity';
import { Order } from '../order/order.entity';
import { Payment, PaymentMetadata } from '../payment/payment.entity';

/**
 * @description
 * A PaymentMethod is created automatically according to the configured {@link PaymentMethodHandler}s defined
 * in the {@link PaymentOptions} config.
 *
 * @docsCategory entities
 */
@Entity()
export class PaymentMethod extends VendureEntity {
    constructor(input?: DeepPartial<PaymentMethod>) {
        super(input);
    }

    @Column() code: string;

    @Column() enabled: boolean;

    @Column('simple-json') configArgs: ConfigArg[];
}
