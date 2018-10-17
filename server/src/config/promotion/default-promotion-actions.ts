import { PromotionAction } from './promotion-action';

export const orderPercentageDiscount = new PromotionAction({
    code: 'order_percentage_discount',
    args: { discount: 'percentage' },
    execute(orderItem, orderLine, args) {
        return -orderLine.unitPrice * (args.discount / 100);
    },
    description: 'Discount order by { discount }%',
});

export const itemPercentageDiscount = new PromotionAction({
    code: 'item_percentage_discount',
    args: { discount: 'percentage' },
    execute(orderItem, orderLine, args) {
        return -orderLine.unitPrice * (args.discount / 100);
    },
    description: 'Discount every item by { discount }%',
});

export const defaultPromotionActions = [orderPercentageDiscount, itemPercentageDiscount];
