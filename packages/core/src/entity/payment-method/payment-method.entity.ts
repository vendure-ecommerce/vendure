import { ConfigArg, ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity } from 'typeorm';

import { VendureEntity } from '../base/base.entity';

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

    @Column({ default: '' }) name: string;

    @Column({ default: '' }) code: string;

    @Column({ default: '' }) description: string;

    @Column() enabled: boolean;

    @Column('simple-json') handler: ConfigurableOperation;
}
