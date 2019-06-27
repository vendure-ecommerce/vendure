import { Adjustment, AdjustmentType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { VendureEntity } from '../base/base.entity';
import { Fulfillment } from '../fulfillment/fulfillment.entity';
import { OrderLine } from '../order-line/order-line.entity';

/**
 * @description
 * An individual item of an {@link OrderLine}.
 *
 * @docsCategory entities
 */
@Entity()
export class OrderItem extends VendureEntity {
    constructor(input?: DeepPartial<OrderItem>) {
        super(input);
    }

    @ManyToOne(type => OrderLine, line => line.items, { onDelete: 'CASCADE' })
    line: OrderLine;

    @Column() readonly unitPrice: number;

    @Column() unitPriceIncludesTax: boolean;

    @Column() taxRate: number;

    @Column('simple-json') pendingAdjustments: Adjustment[];

    @ManyToOne(type => Fulfillment)
    fulfillment: Fulfillment;

    @Column({ default: false }) cancelled: boolean;

    @Calculated()
    get unitPriceWithTax(): number {
        if (this.unitPriceIncludesTax) {
            return this.unitPrice;
        } else {
            return Math.round(this.unitPrice * ((100 + this.taxRate) / 100));
        }
    }

    @Calculated()
    get adjustments(): Adjustment[] {
        if (this.unitPriceIncludesTax) {
            return this.pendingAdjustments;
        } else {
            return this.pendingAdjustments.map(a => {
                if (a.type === AdjustmentType.PROMOTION) {
                    // Add the tax that would have been payable on the discount so that the numbers add up
                    // for the end-user.
                    const adjustmentWithTax = Math.round(a.amount * ((100 + this.taxRate) / 100));
                    return {
                        ...a,
                        amount: adjustmentWithTax,
                    };
                }
                return a;
            });
        }
    }

    /**
     * This is the actual, final price of the OrderItem payable by the customer.
     */
    get unitPriceWithPromotionsAndTax(): number {
        if (this.unitPriceIncludesTax) {
            return this.unitPriceWithPromotions;
        } else {
            return this.unitPriceWithPromotions + this.unitTax;
        }
    }

    get unitTax(): number {
        if (this.unitPriceIncludesTax) {
            return Math.round(
                this.unitPriceWithPromotions - this.unitPriceWithPromotions / ((100 + this.taxRate) / 100),
            );
        } else {
            const taxAdjustment = this.adjustments.find(a => a.type === AdjustmentType.TAX);
            return taxAdjustment ? taxAdjustment.amount : 0;
        }
    }

    get promotionAdjustmentsTotal(): number {
        return this.adjustments
            .filter(a => a.type === AdjustmentType.PROMOTION)
            .reduce((total, a) => total + a.amount, 0);
    }

    get unitPriceWithPromotions(): number {
        return this.unitPrice + this.promotionAdjustmentsTotal;
    }

    clearAdjustments(type?: AdjustmentType) {
        if (!type) {
            this.pendingAdjustments = [];
        } else {
            this.pendingAdjustments = this.pendingAdjustments.filter(a => a.type !== type);
        }
    }
}
