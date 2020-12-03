import { Adjustment, AdjustmentType, TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { grossPriceOf } from '../../common/tax-utils';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { CustomOrderLineFields } from '../custom-entity-fields';
import { OrderItem } from '../order-item/order-item.entity';
import { Order } from '../order/order.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';

/**
 * @description
 * A single line on an {@link Order} which contains one or more {@link OrderItem}s.
 *
 * @docsCategory entities
 */
@Entity()
export class OrderLine extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<OrderLine>) {
        super(input);
    }

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @ManyToOne(type => TaxCategory)
    taxCategory: TaxCategory;

    @ManyToOne(type => Asset)
    featuredAsset: Asset;

    @OneToMany(type => OrderItem, item => item.line)
    items: OrderItem[];

    @ManyToOne(type => Order, order => order.lines, { onDelete: 'CASCADE' })
    order: Order;

    @Column(type => CustomOrderLineFields)
    customFields: CustomOrderLineFields;

    @Calculated()
    get unitPrice(): number {
        return this.firstActiveItemPropOr('unitPrice', 0);
    }

    @Calculated()
    get unitPriceWithTax(): number {
        return this.firstActiveItemPropOr('unitPriceWithTax', 0);
    }

    @Calculated()
    get discountedUnitPrice(): number {
        return this.firstActiveItemPropOr('discountedUnitPrice', 0);
    }

    @Calculated()
    get discountedUnitPriceWithTax(): number {
        return this.firstActiveItemPropOr('discountedUnitPriceWithTax', 0);
    }

    @Calculated()
    get quantity(): number {
        return this.activeItems.length;
    }

    @Calculated()
    get adjustments(): Adjustment[] {
        return this.activeItems.reduce(
            (adjustments, item) => [...adjustments, ...item.adjustments],
            [] as Adjustment[],
        );
    }

    @Calculated()
    get taxLines(): TaxLine[] {
        return this.firstActiveItemPropOr('taxLines', []);
    }

    @Calculated()
    get taxRate(): number {
        return this.firstActiveItemPropOr('taxRate', 0);
    }

    @Calculated()
    get linePrice(): number {
        return summate(this.activeItems, 'unitPrice');
    }

    @Calculated()
    get linePriceWithTax(): number {
        return summate(this.activeItems, 'unitPriceWithTax');
    }

    @Calculated()
    get discountedLinePrice(): number {
        return summate(this.activeItems, 'discountedUnitPrice');
    }

    @Calculated()
    get discountedLinePriceWithTax(): number {
        return summate(this.activeItems, 'discountedUnitPriceWithTax');
    }

    @Calculated()
    get discounts(): Adjustment[] {
        const priceIncludesTax = this.items?.[0]?.listPriceIncludesTax ?? false;
        return this.adjustments.map(adjustment => ({
            ...adjustment,
            amount: priceIncludesTax ? adjustment.amount : grossPriceOf(adjustment.amount, this.taxRate),
        }));
    }

    @Calculated()
    get lineTax(): number {
        return summate(this.activeItems, 'unitTax');
    }

    @Calculated()
    get proratedLinePrice(): number {
        return summate(this.activeItems, 'proratedUnitPrice');
    }

    @Calculated()
    get proratedLinePriceWithTax(): number {
        return summate(this.activeItems, 'proratedUnitPriceWithTax');
    }

    @Calculated()
    get proratedLineTax(): number {
        return summate(this.activeItems, 'proratedUnitTax');
    }

    /**
     * Returns all non-cancelled OrderItems on this line.
     */
    get activeItems(): OrderItem[] {
        return (this.items || []).filter(i => !i.cancelled);
    }

    /**
     * Clears Adjustments from all OrderItems of the given type. If no type
     * is specified, then all adjustments are removed.
     */
    clearAdjustments(type?: AdjustmentType) {
        this.activeItems.forEach(item => item.clearAdjustments(type));
    }

    private firstActiveItemPropOr<K extends keyof OrderItem>(
        prop: K,
        defaultVal: OrderItem[K],
    ): OrderItem[K] {
        return this.activeItems.length ? this.activeItems[0][prop] : defaultVal;
    }
}
