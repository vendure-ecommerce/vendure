import { Adjustment, AdjustmentType } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { Order } from '../order/order.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';

@Entity()
export class OrderLine extends VendureEntity {
    constructor(input?: DeepPartial<OrderLine>) {
        super(input);
    }

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @ManyToOne(type => TaxCategory)
    taxCategory: TaxCategory;

    @ManyToOne(type => Asset)
    featuredAsset: Asset;

    @Column() unitPrice: number;

    @Column() unitPriceIncludesTax: boolean;

    @Column() includedTaxRate: number;

    @OneToMany(type => OrderItem, item => item.line)
    items: OrderItem[];

    @ManyToOne(type => Order, order => order.lines)
    order: Order;

    @Calculated()
    get unitPriceWithPromotions(): number {
        const firstItemPromotionTotal = this.items[0].pendingAdjustments
            .filter(a => a.type === AdjustmentType.PROMOTION)
            .reduce((total, a) => total + a.amount, 0);
        return this.unitPrice + firstItemPromotionTotal;
    }

    @Calculated()
    get unitPriceWithTax(): number {
        if (this.unitPriceIncludesTax) {
            return this.unitPriceWithPromotions;
        } else {
            return this.unitPriceWithPromotions + this.unitTax;
        }
    }

    @Calculated()
    get quantity(): number {
        return this.items ? this.items.length : 0;
    }

    @Calculated()
    get totalPrice(): number {
        return this.unitPriceWithTax * this.quantity;
    }

    @Calculated()
    get adjustments(): Adjustment[] {
        if (this.items) {
            return this.items[0].pendingAdjustments;
        }
        return [];
    }

    get unitTax(): number {
        if (this.unitPriceIncludesTax) {
            return Math.round(
                this.unitPriceWithPromotions -
                    this.unitPriceWithPromotions / ((100 + this.includedTaxRate) / 100),
            );
        } else {
            const taxAdjustment = this.adjustments.find(a => a.type === AdjustmentType.TAX);
            return taxAdjustment ? taxAdjustment.amount : 0;
        }
    }

    /**
     * Clears Adjustments from all OrderItems of the given type. If no type
     * is specified, then all adjustments are removed.
     */
    clearAdjustments(type?: AdjustmentType) {
        this.items.forEach(item => {
            if (!type) {
                item.pendingAdjustments = [];
            } else {
                item.pendingAdjustments = item.pendingAdjustments.filter(a => a.type !== type);
            }
        });
    }
}
