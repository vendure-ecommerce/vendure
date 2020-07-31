import { Column, Entity, OneToMany } from 'typeorm';

import { DeepPartial } from '../../../../common/lib/shared-types';
import { FulfillmentState } from '../../service/helpers/fulfillment-state-machine/fulfillment-state';
import { VendureEntity } from '../base/base.entity';
import { OrderItem } from '../order-item/order-item.entity';

/**
 * @description
 * This entity represents a fulfillment of an Order or part of it, i.e. the {@link OrderItem}s have been
 * delivered to the Customer after successful payment.
 *
 * @docsCategory entities
 */
@Entity()
export class Fulfillment extends VendureEntity {
    constructor(input?: DeepPartial<Fulfillment>) {
        super(input);
    }

    @Column('varchar') state: FulfillmentState;

    @Column({ default: '' })
    trackingCode: string;

    @Column()
    method: string;

    @OneToMany((type) => OrderItem, (orderItem) => orderItem.fulfillment)
    orderItems: OrderItem[];
}
