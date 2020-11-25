import { Adjustment, AdjustmentType } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';
import { Fulfillment } from '../fulfillment/fulfillment.entity';
import { OrderLine } from '../order-line/order-line.entity';
import { Refund } from '../refund/refund.entity';
import { Cancellation } from '../stock-movement/cancellation.entity';
import { DecimalTransformer } from '../value-transformers';

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

    /**
     * @deprecated
     * TODO: remove once the field has been removed from the GraphQL type
     */
    unitPriceIncludesTax = false;

    @Column({ type: 'decimal', precision: 5, scale: 2, transformer: new DecimalTransformer() })
    taxRate: number;

    @Column('simple-json') pendingAdjustments: Adjustment[];

    @ManyToMany(type => Fulfillment, fulfillment => fulfillment.orderItems)
    @JoinTable()
    fulfillments: Fulfillment[];

    @ManyToOne(type => Refund)
    refund: Refund;

    @EntityId({ nullable: true })
    refundId: ID | null;

    @OneToOne(type => Cancellation, cancellation => cancellation.orderItem)
    cancellation: Cancellation;

    @Column({ default: false })
    cancelled: boolean;

    get fulfillment(): Fulfillment | undefined {
        return this.fulfillments?.find(f => f.state !== 'Cancelled');
    }

    @Calculated()
    get unitPriceWithTax(): number {
        return Math.round(this.unitPrice * ((100 + this.taxRate) / 100));
    }

    /**
     * Adjustments with promotion values adjusted to include tax.
     */
    @Calculated()
    get adjustments(): Adjustment[] {
        if (!this.pendingAdjustments) {
            return [];
        }
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

    /**
     * This is the actual, final price of the OrderItem payable by the customer.
     */
    get unitPriceWithPromotionsAndTax(): number {
        return this.unitPriceWithPromotions + this.unitTax;
    }

    get unitTax(): number {
        const taxAdjustment = this.adjustments.find(a => a.type === AdjustmentType.TAX);
        return taxAdjustment ? taxAdjustment.amount : 0;
    }

    get promotionAdjustmentsTotal(): number {
        if (!this.pendingAdjustments) {
            return 0;
        }
        return this.pendingAdjustments
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
            this.pendingAdjustments = this.pendingAdjustments
                ? this.pendingAdjustments.filter(a => a.type !== type)
                : [];
        }
    }
}
