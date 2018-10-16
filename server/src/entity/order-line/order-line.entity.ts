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

    @OneToMany(type => OrderItem, item => item.line)
    items: OrderItem[];

    @ManyToOne(type => Order, order => order.lines)
    order: Order;

    @Calculated()
    get unitPriceWithTax(): number {
        const taxAdjustment = this.adjustments.find(a => a.type === AdjustmentType.TAX);
        return this.unitPrice + (taxAdjustment ? taxAdjustment.amount : 0);
    }

    @Calculated()
    get quantity(): number {
        return this.items ? this.items.length : 0;
    }

    @Calculated()
    get totalPrice(): number {
        const taxAdjustments = this.adjustments
            .filter(a => a.type === AdjustmentType.TAX)
            .reduce((amount, a) => amount + a.amount, 0);
        return this.unitPrice * this.quantity + taxAdjustments;
    }

    @Calculated()
    get adjustments(): Adjustment[] {
        if (this.items) {
            return this.items.reduce(
                (adjustments, i) => [...adjustments, ...i.pendingAdjustments],
                [] as Adjustment[],
            );
        }
        return [];
    }
}
