import { Adjustment, AdjustmentType, Discount, TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { OrderLine } from '..';
import { Calculated } from '../../common/calculated-decorator';
import { roundMoney } from '../../common/round-money';
import { grossPriceOf, netPriceOf } from '../../common/tax-utils';
import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';
import { Money } from '../money.decorator';
import { Order } from '../order/order.entity';
import { ShippingMethod } from '../shipping-method/shipping-method.entity';

/**
 * @description
 * A ShippingLine is created when a {@link ShippingMethod} is applied to an {@link Order}.
 * It contains information about the price of the shipping method, any discounts that were
 * applied, and the resulting tax on the shipping method.
 *
 * @docsCategory entities
 */
@Entity()
export class ShippingLine extends VendureEntity {
    constructor(input?: DeepPartial<ShippingLine>) {
        super(input);
    }

    @EntityId()
    shippingMethodId: ID | null;

    @Index()
    @ManyToOne(type => ShippingMethod)
    shippingMethod: ShippingMethod;

    @Index()
    @ManyToOne(type => Order, order => order.shippingLines, { onDelete: 'CASCADE' })
    order: Order;

    @Money()
    listPrice: number;

    @Column()
    listPriceIncludesTax: boolean;

    @Column('simple-json')
    adjustments: Adjustment[];

    @Column('simple-json')
    taxLines: TaxLine[];

    @OneToMany(type => OrderLine, orderLine => orderLine.shippingLine)
    orderLines: OrderLine[];

    @Calculated()
    get price(): number {
        return this.listPriceIncludesTax ? netPriceOf(this.listPrice, this.taxRate) : this.listPrice;
    }

    @Calculated()
    get priceWithTax(): number {
        return roundMoney(
            this.listPriceIncludesTax ? this.listPrice : grossPriceOf(this.listPrice, this.taxRate),
        );
    }

    @Calculated()
    get discountedPrice(): number {
        const result = this.listPrice + this.getAdjustmentsTotal();
        return roundMoney(this.listPriceIncludesTax ? netPriceOf(result, this.taxRate) : result);
    }

    @Calculated()
    get discountedPriceWithTax(): number {
        const result = this.listPrice + this.getAdjustmentsTotal();
        return roundMoney(this.listPriceIncludesTax ? result : grossPriceOf(result, this.taxRate));
    }

    @Calculated()
    get taxRate(): number {
        return summate(this.taxLines, 'taxRate');
    }

    @Calculated()
    get discounts(): Discount[] {
        return (
            this.adjustments?.map(adjustment => {
                const amount = roundMoney(
                    this.listPriceIncludesTax
                        ? netPriceOf(adjustment.amount, this.taxRate)
                        : adjustment.amount,
                );
                const amountWithTax = roundMoney(
                    this.listPriceIncludesTax
                        ? adjustment.amount
                        : grossPriceOf(adjustment.amount, this.taxRate),
                );
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

    clearAdjustments() {
        this.adjustments = [];
    }

    /**
     * @description
     * The total of all price adjustments. Will typically be a negative number due to discounts.
     */
    private getAdjustmentsTotal(): number {
        return summate(this.adjustments, 'amount');
    }
}
