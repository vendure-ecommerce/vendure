import { Adjustment, AdjustmentType, TaxLine } from '@vendure/common/lib/generated-types';
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

    @Column('simple-json') adjustments: Adjustment[];

    @Column('simple-json')
    taxLines: TaxLine[];

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

    /**
     * @description
     * The total applicable tax rate, which is the sum of all taxLines on this
     * OrderItem.
     */
    @Calculated()
    get taxRate(): number {
        return this.taxLines.reduce((total, l) => total + l.taxRate, 0);
    }

    @Calculated()
    get unitPriceWithTax(): number {
        return Math.round(this.unitPrice * ((100 + this.taxRate) / 100));
    }

    /**
     * This is the actual, final price of the OrderItem payable by the customer.
     */
    get unitPriceWithPromotionsAndTax(): number {
        return this.unitPriceWithPromotions + this.unitTax;
    }

    get unitTax(): number {
        return this.taxLines.reduce((total, l) => total + l.amount, 0);
    }

    get promotionAdjustmentsTotal(): number {
        if (!this.adjustments) {
            return 0;
        }
        return this.adjustments
            .filter(a => a.type === AdjustmentType.PROMOTION)
            .reduce((total, a) => total + a.amount, 0);
    }

    get unitPriceWithPromotions(): number {
        return this.unitPrice + this.promotionAdjustmentsTotal;
    }

    clearAdjustments(type?: AdjustmentType) {
        if (!type) {
            this.adjustments = [];
        } else {
            this.adjustments = this.adjustments ? this.adjustments.filter(a => a.type !== type) : [];
        }
    }
}
