import { RequestContext } from '../../api/common/request-context';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { CustomOrderLineFields, Order, OrderLine, ProductVariant } from '../../entity/index';

export interface WillAddItemToOrderInput {
    productVariant: ProductVariant;
    quantity: number;
    customFields?: CustomOrderLineFields;
}

export interface WillAdjustOrderLineInput {
    orderLine: OrderLine;
    quantity: number;
    customFields?: CustomOrderLineFields;
}

export interface OrderInterceptor extends InjectableStrategy {
    willAddItemToOrder?(
        ctx: RequestContext,
        order: Order,
        input: WillAddItemToOrderInput,
    ): Promise<void | string>;

    willAdjustOrderLine?(
        ctx: RequestContext,
        order: Order,
        input: WillAdjustOrderLineInput,
    ): Promise<void | string>;

    willRemoveItemFromOrder?(ctx: RequestContext, order: Order, orderLine: OrderLine): Promise<void | string>;
}
