import { ConfigArg, ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { ChannelAware } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomPaymentMethodFields } from '../custom-entity-fields';

/**
 * @description
 * A PaymentMethod is created automatically according to the configured {@link PaymentMethodHandler}s defined
 * in the {@link PaymentOptions} config.
 *
 * @docsCategory entities
 */
@Entity()
export class PaymentMethod extends VendureEntity implements ChannelAware, HasCustomFields {
    constructor(input?: DeepPartial<PaymentMethod>) {
        super(input);
    }

    @Column({ default: '' }) name: string;

    @Column({ default: '' }) code: string;

    @Column({ default: '' }) description: string;

    @Column() enabled: boolean;

    @Column('simple-json', { nullable: true }) checker: ConfigurableOperation | null;

    @Column('simple-json') handler: ConfigurableOperation;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];

    @Column(type => CustomPaymentMethodFields)
    customFields: CustomPaymentMethodFields;
}
