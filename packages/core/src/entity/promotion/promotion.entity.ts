import { Adjustment, AdjustmentType, ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { AdjustmentSource } from '../../common/types/adjustment-source';
import { ChannelAware, SoftDeletable } from '../../common/types/common-types';
import { getConfig } from '../../config/config-helpers';
import {
    PromotionAction,
    PromotionItemAction,
    PromotionOrderAction,
    PromotionShippingAction,
} from '../../config/promotion/promotion-action';
import { PromotionCondition, PromotionConditionState } from '../../config/promotion/promotion-condition';
import { Channel } from '../channel/channel.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { OrderLine } from '../order-line/order-line.entity';
import { Order } from '../order/order.entity';
import { ShippingLine } from '../shipping-line/shipping-line.entity';

export interface ApplyOrderItemActionArgs {
    orderItem: OrderItem;
    orderLine: OrderLine;
}

export interface ApplyOrderActionArgs {
    order: Order;
}

export interface ApplyShippingActionArgs {
    shippingLine: ShippingLine;
    order: Order;
}

export interface PromotionState {
    [code: string]: PromotionConditionState;
}

export type PromotionTestResult = boolean | PromotionState;

/**
 * @description
 * A Promotion is used to define a set of conditions under which promotions actions (typically discounts)
 * will be applied to an Order.
 *
 * Each assigned {@link PromotionCondition} is checked against the Order, and if they all return `true`,
 * then each assign {@link PromotionItemAction} / {@link PromotionOrderAction} is applied to the Order.
 *
 * @docsCategory entities
 */
@Entity()
export class Promotion extends AdjustmentSource implements ChannelAware, SoftDeletable {
    type = AdjustmentType.PROMOTION;
    private readonly allConditions: { [code: string]: PromotionCondition } = {};
    private readonly allActions: {
        [code: string]: PromotionItemAction | PromotionOrderAction | PromotionShippingAction;
    } = {};

    constructor(
        input?: DeepPartial<Promotion> & {
            promotionConditions?: Array<PromotionCondition<any>>;
            promotionActions?: Array<PromotionAction<any>>;
        },
    ) {
        super(input);
        const conditions =
            (input && input.promotionConditions) || getConfig().promotionOptions.promotionConditions || [];
        const actions =
            (input && input.promotionActions) || getConfig().promotionOptions.promotionActions || [];
        this.allConditions = conditions.reduce((hash, o) => ({ ...hash, [o.code]: o }), {});
        this.allActions = actions.reduce((hash, o) => ({ ...hash, [o.code]: o }), {});
    }

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @Column({ type: Date, nullable: true })
    startsAt: Date | null;

    @Column({ type: Date, nullable: true })
    endsAt: Date | null;

    @Column({ nullable: true })
    couponCode: string;

    @Column({ nullable: true })
    perCustomerUsageLimit: number;

    @Column() name: string;

    @Column() enabled: boolean;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];

    @Column('simple-json') conditions: ConfigurableOperation[];

    @Column('simple-json') actions: ConfigurableOperation[];

    /**
     * @description
     * The PriorityScore is used to determine the sequence in which multiple promotions are tested
     * on a given order. A higher number moves the Promotion towards the end of the sequence.
     *
     * The score is derived from the sum of the priorityValues of the PromotionConditions and
     * PromotionActions comprising this Promotion.
     *
     * An example illustrating the need for a priority is this:
     *
     *
     * Consider 2 Promotions, 1) buy 1 get one free and 2) 10% off when order total is over $50.
     * If Promotion 2 is evaluated prior to Promotion 1, then it can trigger the 10% discount even
     * if the subsequent application of Promotion 1 brings the order total down to way below $50.
     */
    @Column() priorityScore: number;

    async apply(
        ctx: RequestContext,
        args: ApplyOrderActionArgs | ApplyOrderItemActionArgs | ApplyShippingActionArgs,
        state?: PromotionState,
    ): Promise<Adjustment | undefined> {
        let amount = 0;
        state = state || {};

        for (const action of this.actions) {
            const promotionAction = this.allActions[action.code];
            if (promotionAction instanceof PromotionItemAction) {
                if (this.isOrderItemArg(args)) {
                    const { orderItem, orderLine } = args;
                    amount += Math.round(
                        await promotionAction.execute(ctx, orderItem, orderLine, action.args, state),
                    );
                }
            } else if (promotionAction instanceof PromotionOrderAction) {
                if (this.isOrderArg(args)) {
                    const { order } = args;
                    amount += Math.round(await promotionAction.execute(ctx, order, action.args, state));
                }
            } else if (promotionAction instanceof PromotionShippingAction) {
                if (this.isShippingArg(args)) {
                    const { shippingLine, order } = args;
                    amount += Math.round(
                        await promotionAction.execute(ctx, shippingLine, order, action.args, state),
                    );
                }
            }
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

    async test(ctx: RequestContext, order: Order): Promise<PromotionTestResult> {
        if (this.endsAt && this.endsAt < new Date()) {
            return false;
        }
        if (this.startsAt && this.startsAt > new Date()) {
            return false;
        }
        if (this.couponCode && !order.couponCodes.includes(this.couponCode)) {
            return false;
        }
        const promotionState: PromotionState = {};
        for (const condition of this.conditions) {
            const promotionCondition = this.allConditions[condition.code];
            if (!promotionCondition) {
                return false;
            }
            const applicableOrConditionState = await promotionCondition.check(ctx, order, condition.args);
            if (!applicableOrConditionState) {
                return false;
            }
            if (typeof applicableOrConditionState === 'object') {
                promotionState[condition.code] = applicableOrConditionState;
            }
        }
        return promotionState;
    }
    private isShippingAction(
        value: PromotionItemAction | PromotionOrderAction | PromotionShippingAction,
    ): value is PromotionItemAction {
        return value instanceof PromotionShippingAction;
    }

    private isOrderArg(
        value: ApplyOrderItemActionArgs | ApplyOrderActionArgs | ApplyShippingActionArgs,
    ): value is ApplyOrderActionArgs {
        return !this.isOrderItemArg(value) && !this.isShippingArg(value);
    }

    private isOrderItemArg(
        value: ApplyOrderItemActionArgs | ApplyOrderActionArgs | ApplyShippingActionArgs,
    ): value is ApplyOrderItemActionArgs {
        return value.hasOwnProperty('orderItem');
    }

    private isShippingArg(
        value: ApplyOrderItemActionArgs | ApplyOrderActionArgs | PromotionShippingAction,
    ): value is ApplyShippingActionArgs {
        return value.hasOwnProperty('shippingLine');
    }
}
