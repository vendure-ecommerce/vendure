import { Adjustment, AdjustmentType, TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { grossPriceOf, netPriceOf } from '../../common/tax-utils';
import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';
import { Fulfillment } from '../fulfillment/fulfillment.entity';
import { OrderLine } from '../order-line/order-line.entity';
import { Refund } from '../refund/refund.entity';
import { Cancellation } from '../stock-movement/cancellation.entity';

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

    /**
     * @description
     * This is the price as listed by the ProductVariant, which, depending on the
     * current Channel, may or may not include tax.
     */
    @Column()
    readonly listPrice: number;

    /**
     * @description
     * Whether or not the listPrice includes tax, which depends on the settings
     * of the current Channel.
     */
    @Column()
    readonly listPriceIncludesTax: boolean;

    @Column('simple-json')
    adjustments: Adjustment[];

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

    @Calculated()
    get unitPrice(): number {
        return this.listPriceIncludesTax ? netPriceOf(this.listPrice, this.taxRate) : this.listPrice;
    }

    @Calculated()
    get unitPriceWithTax(): number {
        return this.listPriceIncludesTax ? this.listPrice : grossPriceOf(this.listPrice, this.taxRate);
    }

    /**
     * @description
     * The total applicable tax rate, which is the sum of all taxLines on this
     * OrderItem.
     */
    @Calculated()
    get taxRate(): number {
        return summate(this.taxLines, 'taxRate');
    }

    @Calculated()
    get unitTax(): number {
        return this.unitPriceWithTax - this.unitPrice;
    }

    @Calculated()
    get discountedUnitPrice(): number {
        const result = this.listPrice + this.getAdjustmentsTotal(AdjustmentType.PROMOTION);
        return this.listPriceIncludesTax ? netPriceOf(result, this.taxRate) : result;
    }

    @Calculated()
    get discountedUnitPriceWithTax(): number {
        const result = this.listPrice + this.getAdjustmentsTotal(AdjustmentType.PROMOTION);
        return this.listPriceIncludesTax ? result : grossPriceOf(result, this.taxRate);
    }

    @Calculated()
    get proratedUnitPrice(): number {
        const result = this.listPrice + this.getAdjustmentsTotal();
        return this.listPriceIncludesTax ? netPriceOf(result, this.taxRate) : result;
    }

    @Calculated()
    get proratedUnitPriceWithTax(): number {
        const result = this.listPrice + this.getAdjustmentsTotal();
        return this.listPriceIncludesTax ? result : grossPriceOf(result, this.taxRate);
    }

    @Calculated()
    get proratedUnitTax(): number {
        return this.proratedUnitPriceWithTax - this.proratedUnitPrice;
    }

    /**
     * @description
     * The total of all price adjustments. Will typically be a negative number due to discounts.
     */
    private getAdjustmentsTotal(type?: AdjustmentType): number {
        if (!this.adjustments) {
            return 0;
        }
        return this.adjustments
            .filter(adjustment => (type ? adjustment.type === type : true))
            .reduce((total, a) => total + a.amount, 0);
    }

    addAdjustment(adjustment: Adjustment) {
        this.adjustments = this.adjustments.concat(adjustment);
    }

    clearAdjustments(type?: AdjustmentType) {
        if (!type) {
            this.adjustments = [];
        } else {
            this.adjustments = this.adjustments ? this.adjustments.filter(a => a.type !== type) : [];
        }
    }
}
