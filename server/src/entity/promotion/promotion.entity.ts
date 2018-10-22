import { Adjustment, AdjustmentOperation, AdjustmentType } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { AdjustmentSource } from '../../common/types/adjustment-source';
import { PromotionAction } from '../../config/promotion/promotion-action';
import { PromotionCondition } from '../../config/promotion/promotion-condition';
import { getConfig } from '../../config/vendure-config';
import { Channel } from '../channel/channel.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { OrderLine } from '../order-line/order-line.entity';
import { Order } from '../order/order.entity';

@Entity()
export class Promotion extends AdjustmentSource {
    type = AdjustmentType.PROMOTION;
    private readonly allConditions: { [code: string]: PromotionCondition } = {};
    private readonly allActions: { [code: string]: PromotionAction } = {};

    constructor(input?: DeepPartial<Promotion>) {
        super(input);
        this.allConditions = getConfig().promotionConditions.reduce(
            (hash, o) => ({ ...hash, [o.code]: o }),
            {},
        );
        this.allActions = getConfig().promotionActions.reduce((hash, o) => ({ ...hash, [o.code]: o }), {});
    }

    @Column() name: string;

    @Column() enabled: boolean;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];

    @Column('simple-json') conditions: AdjustmentOperation[];

    @Column('simple-json') actions: AdjustmentOperation[];

    apply(orderItem: OrderItem, orderLine: OrderLine): Adjustment | undefined {
        let amount = 0;

        for (const action of this.actions) {
            const promotionAction = this.allActions[action.code];
            amount += Math.round(promotionAction.execute(orderItem, orderLine, action.args));
        }
        if (amount !== 0) {
            return {
                amount,
                type: this.type,
                description: this.name,
                adjustmentSource: this.getSourceId(),
            };
        }
    }

    test(order: Order): boolean {
        for (const condition of this.conditions) {
            const promotionCondition = this.allConditions[condition.code];
            if (!promotionCondition || !promotionCondition.check(order, condition.args)) {
                return false;
            }
        }
        return true;
    }
}
