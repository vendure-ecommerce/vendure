import { Adjustment, AdjustmentType, Discount, TaxLine } from '@vendure/common/lib/generated-types';
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

    // TODO: v2 - Add `{ onDelete: 'CASCADE' }` constraint
    @ManyToOne(type => Order, order => order.shippingLines)
    order: Order;

    @Column()
    listPrice: number;

    @Column()
    listPriceIncludesTax: boolean;

    @Column('simple-json')
    adjustments: Adjustment[];

    @Column('simple-json')
    taxLines: TaxLine[];

    @Calculated()
    get price(): number {
        return this.listPriceIncludesTax ? netPriceOf(this.listPrice, this.taxRate) : this.listPrice;
    }

    @Calculated()
    get priceWithTax(): number {
        return this.listPriceIncludesTax ? this.listPrice : grossPriceOf(this.listPrice, this.taxRate);
    }

    @Calculated()
    get discountedPrice(): number {
        const result = this.listPrice + this.getAdjustmentsTotal();
        return this.listPriceIncludesTax ? netPriceOf(result, this.taxRate) : result;
    }

    @Calculated()
    get discountedPriceWithTax(): number {
        const result = this.listPrice + this.getAdjustmentsTotal();
        return this.listPriceIncludesTax ? result : grossPriceOf(result, this.taxRate);
    }

    @Calculated()
    get taxRate(): number {
        return summate(this.taxLines, 'taxRate');
    }

    @Calculated()
    get discounts(): Discount[] {
        return (
            this.adjustments?.map(adjustment => {
                const amount = this.listPriceIncludesTax
                    ? netPriceOf(adjustment.amount, this.taxRate)
                    : adjustment.amount;
                const amountWithTax = this.listPriceIncludesTax
                    ? adjustment.amount
                    : grossPriceOf(adjustment.amount, this.taxRate);
                return {
                    ...(adjustment as Omit<Adjustment, '__typename'>),
                    amount,
                    amountWithTax,
                };
            }) ?? []
        );
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
