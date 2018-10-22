import { PromotionAction, PromotionItemAction, PromotionOrderAction } from './promotion-action';

export const orderPercentageDiscount = new PromotionOrderAction({
    code: 'order_percentage_discount',
    args: { discount: 'percentage' },
    execute(order, args) {
        return -order.subTotal * (args.discount / 100);
    },
    description: 'Discount order by { discount }%',
});

export const itemPercentageDiscount = new PromotionItemAction({
    code: 'item_percentage_discount',
    args: { discount: 'percentage' },
    execute(orderItem, orderLine, args) {
        return -orderLine.unitPrice * (args.discount / 100);
    },
    description: 'Discount every item by { discount }%',
});

export const buy1Get1Free = new PromotionItemAction({
    code: 'buy_1_get_1_free',
    args: {},
    execute(orderItem, orderLine, args) {
        if (orderLine.quantity >= 2) {
            const lineIndex = orderLine.items.indexOf(orderItem) + 1;
            if (lineIndex % 2 === 0) {
                return -orderLine.unitPrice;
            }
        }
        return 0;
    },
    description: 'Discount every item by { discount }%',
});

export const defaultPromotionActions = [orderPercentageDiscount, itemPercentageDiscount, buy1Get1Free];
