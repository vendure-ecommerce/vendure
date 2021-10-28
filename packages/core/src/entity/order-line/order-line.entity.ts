import { Adjustment, AdjustmentType, Discount, TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { grossPriceOf, netPriceOf } from '../../common/tax-utils';
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

    /**
     * @description
     * The price of a single unit, excluding tax and discounts.
     */
    @Calculated()
    get unitPrice(): number {
        return this.firstActiveItemPropOr('unitPrice', 0);
    }

    /**
     * @description
     * The price of a single unit, including tax but excluding discounts.
     */
    @Calculated()
    get unitPriceWithTax(): number {
        return this.firstActiveItemPropOr('unitPriceWithTax', 0);
    }

    /**
     * @description
     * Non-zero if the `unitPrice` has changed since it was initially added to Order.
     */
    @Calculated()
    get unitPriceChangeSinceAdded(): number {
        const firstItem = this.activeItems[0];
        if (!firstItem) {
            return 0;
        }
        const { initialListPrice, listPriceIncludesTax } = firstItem;
        const initialPrice = listPriceIncludesTax
            ? netPriceOf(initialListPrice, this.taxRate)
            : initialListPrice;
        return this.unitPrice - initialPrice;
    }

    /**
     * @description
     * Non-zero if the `unitPriceWithTax` has changed since it was initially added to Order.
     */
    @Calculated()
    get unitPriceWithTaxChangeSinceAdded(): number {
        const firstItem = this.activeItems[0];
        if (!firstItem) {
            return 0;
        }
        const { initialListPrice, listPriceIncludesTax } = firstItem;
        const initialPriceWithTax = listPriceIncludesTax
            ? initialListPrice
            : grossPriceOf(initialListPrice, this.taxRate);
        return this.unitPriceWithTax - initialPriceWithTax;
    }

    /**
     * @description
     * The price of a single unit including discounts, excluding tax.
     *
     * If Order-level discounts have been applied, this will not be the
     * actual taxable unit price (see `proratedUnitPrice`), but is generally the
     * correct price to display to customers to avoid confusion
     * about the internal handling of distributed Order-level discounts.
     */
    @Calculated()
    get discountedUnitPrice(): number {
        return this.firstActiveItemPropOr('discountedUnitPrice', 0);
    }

    /**
     * @description
     * The price of a single unit including discounts and tax
     */
    @Calculated()
    get discountedUnitPriceWithTax(): number {
        return this.firstActiveItemPropOr('discountedUnitPriceWithTax', 0);
    }

    /**
     * @description
     * The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
     * Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
     * and refund calculations.
     */
    @Calculated()
    get proratedUnitPrice(): number {
        return this.firstActiveItemPropOr('proratedUnitPrice', 0);
    }

    /**
     * @description
     * The `proratedUnitPrice` including tax.
     */
    @Calculated()
    get proratedUnitPriceWithTax(): number {
        return this.firstActiveItemPropOr('proratedUnitPriceWithTax', 0);
    }

    @Calculated()
    get quantity(): number {
        return this.activeItems.length;
    }

    @Calculated()
    get adjustments(): Adjustment[] {
        return this.activeItems.reduce(
            (adjustments, item) => [...adjustments, ...(item.adjustments || [])],
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

    /**
     * @description
     * The total price of the line excluding tax and discounts.
     */
    @Calculated()
    get linePrice(): number {
        return summate(this.activeItems, 'unitPrice');
    }

    /**
     * @description
     * The total price of the line including tax but excluding discounts.
     */
    @Calculated()
    get linePriceWithTax(): number {
        return summate(this.activeItems, 'unitPriceWithTax');
    }

    /**
     * @description
     * The price of the line including discounts, excluding tax.
     */
    @Calculated()
    get discountedLinePrice(): number {
        return summate(this.activeItems, 'discountedUnitPrice');
    }

    /**
     * @description
     * The price of the line including discounts and tax.
     */
    @Calculated()
    get discountedLinePriceWithTax(): number {
        return summate(this.activeItems, 'discountedUnitPriceWithTax');
    }

    @Calculated()
    get discounts(): Discount[] {
        const priceIncludesTax = this.items?.[0]?.listPriceIncludesTax ?? false;
        // Group discounts together, so that it does not list a new
        // discount row for each OrderItem in the line
        const groupedDiscounts = new Map<string, Discount>();
        for (const adjustment of this.adjustments) {
            const discountGroup = groupedDiscounts.get(adjustment.adjustmentSource);
            const amount = priceIncludesTax ? netPriceOf(adjustment.amount, this.taxRate) : adjustment.amount;
            const amountWithTax = priceIncludesTax
                ? adjustment.amount
                : grossPriceOf(adjustment.amount, this.taxRate);
            if (discountGroup) {
                discountGroup.amount += amount;
                discountGroup.amountWithTax += amountWithTax;
            } else {
                groupedDiscounts.set(adjustment.adjustmentSource, {
                    ...(adjustment as Omit<Adjustment, '__typename'>),
                    amount,
                    amountWithTax,
                });
            }
        }
        return [...groupedDiscounts.values()];
    }

    /**
     * @description
     * The total tax on this line.
     */
    @Calculated()
    get lineTax(): number {
        return summate(this.activeItems, 'unitTax');
    }

    /**
     * @description
     * The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
     * Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
     * and refund calculations.
     */
    @Calculated()
    get proratedLinePrice(): number {
        return summate(this.activeItems, 'proratedUnitPrice');
    }

    /**
     * @description
     * The `proratedLinePrice` including tax.
     */
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
     * Returns the first OrderItems of the line (i.e. the one with the earliest
     * `createdAt` property).
     */
    get firstItem(): OrderItem | undefined {
        return (this.items ?? []).sort((a, b) => +a.createdAt - +b.createdAt)[0];
    }

    /**
     * Clears Adjustments from all OrderItems of the given type. If no type
     * is specified, then all adjustments are removed.
     */
    clearAdjustments(type?: AdjustmentType) {
        this.items.forEach(item => item.clearAdjustments(type));
    }

    private firstActiveItemPropOr<K extends keyof OrderItem>(
        prop: K,
        defaultVal: OrderItem[K],
    ): OrderItem[K] {
        return this.activeItems.length ? this.activeItems[0][prop] : defaultVal;
    }
}
