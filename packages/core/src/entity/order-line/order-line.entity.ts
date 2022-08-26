import { Adjustment, AdjustmentType, Discount, TaxLine } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { grossPriceOf, netPriceOf } from '../../common/tax-utils';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Logger } from '../../config/index';
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

    @OneToMany(type => OrderItem, item => item.line, { eager: true })
    items: OrderItem[];

    @ManyToOne(type => Order, order => order.lines, { onDelete: 'CASCADE' })
    order: Order;

    @Column(type => CustomOrderLineFields)
    customFields: CustomOrderLineFields;

    /**
     * @description
     * The price of a single unit, excluding tax and discounts.
     */
    @Calculated({ relations: ['items'] })
    get unitPrice(): number {
        return this.firstActiveItemPropOr('unitPrice', 0);
    }

    /**
     * @description
     * The price of a single unit, including tax but excluding discounts.
     */
    @Calculated({ relations: ['items'] })
    get unitPriceWithTax(): number {
        return this.firstActiveItemPropOr('unitPriceWithTax', 0);
    }

    /**
     * @description
     * Non-zero if the `unitPrice` has changed since it was initially added to Order.
     */
    @Calculated({ relations: ['items'] })
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
    @Calculated({ relations: ['items'] })
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
    @Calculated({ relations: ['items'] })
    get discountedUnitPrice(): number {
        return this.firstActiveItemPropOr('discountedUnitPrice', 0);
    }

    /**
     * @description
     * The price of a single unit including discounts and tax
     */
    @Calculated({ relations: ['items'] })
    get discountedUnitPriceWithTax(): number {
        return this.firstActiveItemPropOr('discountedUnitPriceWithTax', 0);
    }

    /**
     * @description
     * The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
     * Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
     * and refund calculations.
     */
    @Calculated({ relations: ['items'] })
    get proratedUnitPrice(): number {
        return this.firstActiveItemPropOr('proratedUnitPrice', 0);
    }

    /**
     * @description
     * The `proratedUnitPrice` including tax.
     */
    @Calculated({ relations: ['items'] })
    get proratedUnitPriceWithTax(): number {
        return this.firstActiveItemPropOr('proratedUnitPriceWithTax', 0);
    }

    @Calculated({ relations: ['items'] })
    get quantity(): number {
        return this.activeItems.length;
    }

    @Calculated({ relations: ['items'] })
    get adjustments(): Adjustment[] {
        return this.activeItems.reduce(
            (adjustments, item) => [...adjustments, ...(item.adjustments || [])],
            [] as Adjustment[],
        );
    }

    @Calculated({ relations: ['items'] })
    get taxLines(): TaxLine[] {
        return this.firstActiveItemPropOr('taxLines', []);
    }

    @Calculated({ relations: ['items'] })
    get taxRate(): number {
        return this.firstActiveItemPropOr('taxRate', 0);
    }

    /**
     * @description
     * The total price of the line excluding tax and discounts.
     */
    @Calculated({ relations: ['items'] })
    get linePrice(): number {
        return summate(this.activeItems, 'unitPrice');
    }

    /**
     * @description
     * The total price of the line including tax but excluding discounts.
     */
    @Calculated({ relations: ['items'] })
    get linePriceWithTax(): number {
        return summate(this.activeItems, 'unitPriceWithTax');
    }

    /**
     * @description
     * The price of the line including discounts, excluding tax.
     */
    @Calculated({ relations: ['items'] })
    get discountedLinePrice(): number {
        return summate(this.activeItems, 'discountedUnitPrice');
    }

    /**
     * @description
     * The price of the line including discounts and tax.
     */
    @Calculated({ relations: ['items'] })
    get discountedLinePriceWithTax(): number {
        return summate(this.activeItems, 'discountedUnitPriceWithTax');
    }

    @Calculated({ relations: ['items'] })
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
    @Calculated({ relations: ['items'] })
    get lineTax(): number {
        return summate(this.activeItems, 'unitTax');
    }

    /**
     * @description
     * The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
     * Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
     * and refund calculations.
     */
    @Calculated({ relations: ['items'] })
    get proratedLinePrice(): number {
        return summate(this.activeItems, 'proratedUnitPrice');
    }

    /**
     * @description
     * The `proratedLinePrice` including tax.
     */
    @Calculated({ relations: ['items'] })
    get proratedLinePriceWithTax(): number {
        return summate(this.activeItems, 'proratedUnitPriceWithTax');
    }

    @Calculated({ relations: ['items'] })
    get proratedLineTax(): number {
        return summate(this.activeItems, 'proratedUnitTax');
    }

    /**
     * Returns all non-cancelled OrderItems on this line.
     */
    get activeItems(): OrderItem[] {
        if (this.items == null) {
            Logger.warn(
                `Attempted to access OrderLine.items without first joining the relation: { relations: ['items'] }`,
            );
        }
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

    /**
     * @description
     * Fetches the specified property of the first active (non-cancelled) OrderItem.
     * If all OrderItems are cancelled (e.g. in a full cancelled Order), then fetches from
     * the first OrderItem.
     */
    private firstActiveItemPropOr<K extends keyof OrderItem>(
        prop: K,
        defaultVal: OrderItem[K],
    ): OrderItem[K] {
        const items = this.activeItems.length ? this.activeItems : this.items ?? [];
        return items.length ? items[0][prop] : defaultVal;
    }
}
