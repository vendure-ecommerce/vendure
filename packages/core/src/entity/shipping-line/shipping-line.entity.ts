import { Adjustment, AdjustmentType } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { grossPriceOf, netPriceOf } from '../../common/tax-utils';
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

    @Calculated()
    get discountedPrice(): number {
        return this.price + this.getAdjustmentsTotal();
    }

    @Calculated()
    get discountedPriceWithTax(): number {
        return this.priceWithTax + this.getAdjustmentsTotal();
    }

    @Column('simple-json')
    adjustments: Adjustment[];

    @Calculated()
    get discounts(): Adjustment[] {
        return this.adjustments || [];
    }

    addAdjustment(adjustment: Adjustment) {
        this.adjustments = this.adjustments.concat(adjustment);
    }

    /**
     * @description
     * The total of all price adjustments. Will typically be a negative number due to discounts.
     */
    private getAdjustmentsTotal(): number {
        return summate(this.adjustments, 'amount');
    }
}
