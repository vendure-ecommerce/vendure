import { Adjustment } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';
import { Order } from '../order/order.entity';
import { ShippingMethod } from '../shipping-method/shipping-method.entity';

@Entity()
export class ShippingLine extends VendureEntity {
    constructor(input?: DeepPartial<ShippingLine>) {
        super(input);
    }

    @EntityId()
    shippingMethodId: ID | null;

    @ManyToOne(type => ShippingMethod)
    shippingMethod: ShippingMethod | null;

    @ManyToOne(type => Order, order => order.shippingLines)
    order: Order;

    @Column()
    price: number;

    @Column()
    priceWithTax: number;

    @Column('simple-json')
    adjustments: Adjustment[];

    @Calculated()
    get discounts(): Adjustment[] {
        return this.adjustments;
    }
}
