import { DeepPartial, ID } from 'shared/shared-types';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { Adjustment } from '../../common/types/adjustment-source';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { Order } from '../order/order.entity';
import { ProductVariant } from '../product-variant/product-variant.entity';

@Entity()
export class OrderLine extends VendureEntity {
    constructor(input?: DeepPartial<OrderLine>) {
        super(input);
    }

    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;

    @Column('varchar') taxCategoryId: ID;

    @ManyToOne(type => Asset)
    featuredAsset: Asset;

    @Column() unitPrice: number;

    @OneToMany(type => OrderItem, item => item.line)
    items: OrderItem[];

    @ManyToOne(type => Order, order => order.lines)
    order: Order;

    @Calculated()
    get quantity(): number {
        return this.items ? this.items.length : 0;
    }

    @Calculated()
    get totalPrice(): number {
        return this.unitPrice * this.quantity;
    }
}
