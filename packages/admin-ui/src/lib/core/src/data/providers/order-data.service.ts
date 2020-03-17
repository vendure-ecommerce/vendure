import {
    AddNoteToOrder,
    AddNoteToOrderInput,
    CancelOrder,
    CancelOrderInput,
    CreateFulfillment,
    FulfillOrderInput,
    GetOrder,
    GetOrderHistory,
    GetOrderList,
    HistoryEntryListOptions,
    RefundOrder,
    RefundOrderInput,
    SettlePayment,
    SettleRefund,
    SettleRefundInput,
} from '../../common/generated-types';
import {
    ADD_NOTE_TO_ORDER,
    CANCEL_ORDER,
    CREATE_FULFILLMENT,
    GET_ORDER,
    GET_ORDER_HISTORY,
    GET_ORDERS_LIST,
    REFUND_ORDER,
    SETTLE_PAYMENT,
    SETTLE_REFUND,
} from '../definitions/order-definitions';

import { BaseDataService } from './base-data.service';

export class OrderDataService {
    constructor(private baseDataService: BaseDataService) {}

    getOrders(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetOrderList.Query, GetOrderList.Variables>(GET_ORDERS_LIST, {
            options: {
                take,
                skip,
            },
        });
    }

    getOrder(id: string) {
        return this.baseDataService.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id });
    }

    getOrderHistory(id: string, options?: HistoryEntryListOptions) {
        return this.baseDataService.query<GetOrderHistory.Query, GetOrderHistory.Variables>(
            GET_ORDER_HISTORY,
            {
                id,
                options,
            },
        );
    }

    settlePayment(id: string) {
        return this.baseDataService.mutate<SettlePayment.Mutation, SettlePayment.Variables>(SETTLE_PAYMENT, {
            id,
        });
    }

    createFullfillment(input: FulfillOrderInput) {
        return this.baseDataService.mutate<CreateFulfillment.Mutation, CreateFulfillment.Variables>(
            CREATE_FULFILLMENT,
            {
                input,
            },
        );
    }

    cancelOrder(input: CancelOrderInput) {
        return this.baseDataService.mutate<CancelOrder.Mutation, CancelOrder.Variables>(CANCEL_ORDER, {
            input,
        });
    }

    refundOrder(input: RefundOrderInput) {
        return this.baseDataService.mutate<RefundOrder.Mutation, RefundOrder.Variables>(REFUND_ORDER, {
            input,
        });
    }

    settleRefund(input: SettleRefundInput, orderId: string) {
        return this.baseDataService.mutate<SettleRefund.Mutation, SettleRefund.Variables>(SETTLE_REFUND, {
            input,
        });
    }

    addNoteToOrder(input: AddNoteToOrderInput) {
        return this.baseDataService.mutate<AddNoteToOrder.Mutation, AddNoteToOrder.Variables>(
            ADD_NOTE_TO_ORDER,
            {
                input,
            },
        );
    }
}
