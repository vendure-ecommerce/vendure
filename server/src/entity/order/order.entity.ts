import { Adjustment, AdjustmentType, ShippingAddress } from 'shared/generated-types';
import { DeepPartial, ID } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { idType } from '../../config/vendure-config';
import { OrderState } from '../../service/helpers/order-state-machine/order-state';
import { VendureEntity } from '../base/base.entity';
import { Customer } from '../customer/customer.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { OrderLine } from '../order-line/order-line.entity';
import { Payment } from '../payment/payment.entity';
import { ShippingMethod } from '../shipping-method/shipping-method.entity';

@Entity()
export class Order extends VendureEntity {
    constructor(input?: DeepPartial<Order>) {
        super(input);
    }

    @Column() code: string;

    @Column('varchar') state: OrderState;

    @Column({ default: true })
    active: boolean;

    @ManyToOne(type => Customer)
    customer: Customer;

    @OneToMany(type => OrderLine, line => line.order)
    lines: OrderLine[];

    @Column('simple-json') pendingAdjustments: Adjustment[];

    @Column('simple-json') shippingAddress: ShippingAddress;

    @OneToMany(type => Payment, payment => payment.order)
    payments: Payment[];

    @Column() subTotalBeforeTax: number;

    @Column() subTotal: number;

    @Column({ type: idType(), nullable: true })
    shippingMethodId: ID | null;

    @ManyToOne(type => ShippingMethod)
    shippingMethod: ShippingMethod | null;

    @Column({ default: 0 })
    shipping: number;

    @Calculated()
    get totalBeforeTax(): number {
        return this.subTotalBeforeTax + this.promotionAdjustmentsTotal + (this.shipping || 0);
    }

    @Calculated()
    get total(): number {
        return this.subTotal + this.promotionAdjustmentsTotal + (this.shipping || 0);
    }

    @Calculated()
    get adjustments(): Adjustment[] {
        return this.pendingAdjustments;
    }

    get promotionAdjustmentsTotal(): number {
        return this.adjustments
            .filter(a => a.type === AdjustmentType.PROMOTION)
            .reduce((total, a) => total + a.amount, 0);
    }

    /**
     * Clears Adjustments from all OrderItems of the given type. If no type
     * is specified, then all adjustments are removed.
     */
    clearAdjustments(type?: AdjustmentType) {
        if (!type) {
            this.pendingAdjustments = [];
        } else {
            this.pendingAdjustments = this.pendingAdjustments.filter(a => a.type !== type);
        }
        this.lines.forEach(line => line.clearAdjustments(type));
    }

    getOrderItems(): OrderItem[] {
        return this.lines.reduce(
            (items, line) => {
                return [...items, ...line.items];
            },
            [] as OrderItem[],
        );
    }
}
