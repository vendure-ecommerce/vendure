import {
    AddNoteToOrder,
    AddNoteToOrderInput,
    CancelOrder,
    CancelOrderInput,
    CreateFulfillment,
    DeleteOrderNote,
    FulfillOrderInput,
    GetOrder,
    GetOrderHistory,
    GetOrderList,
    GetOrderSummary,
    HistoryEntryListOptions,
    OrderListOptions,
    RefundOrder,
    RefundOrderInput,
    SettlePayment,
    SettleRefund,
    SettleRefundInput,
    TransitionFulfillmentToState,
    TransitionOrderToState,
    UpdateOrderCustomFields,
    UpdateOrderInput,
    UpdateOrderNote,
    UpdateOrderNoteInput,
} from '../../common/generated-types';
import {
    ADD_NOTE_TO_ORDER,
    CANCEL_ORDER,
    CREATE_FULFILLMENT,
    DELETE_ORDER_NOTE,
    GET_ORDER,
    GET_ORDERS_LIST,
    GET_ORDER_HISTORY,
    GET_ORDER_SUMMARY,
    REFUND_ORDER,
    SETTLE_PAYMENT,
    SETTLE_REFUND,
    TRANSITION_FULFILLMENT_TO_STATE,
    TRANSITION_ORDER_TO_STATE,
    UPDATE_ORDER_CUSTOM_FIELDS,
    UPDATE_ORDER_NOTE,
} from '../definitions/order-definitions';

import { BaseDataService } from './base-data.service';

export class OrderDataService {
    constructor(private baseDataService: BaseDataService) {}

    getOrders(options: OrderListOptions = { take: 10 }) {
        return this.baseDataService.query<GetOrderList.Query, GetOrderList.Variables>(GET_ORDERS_LIST, {
            options,
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

    createFulfillment(input: FulfillOrderInput) {
        return this.baseDataService.mutate<CreateFulfillment.Mutation, CreateFulfillment.Variables>(
            CREATE_FULFILLMENT,
            {
                input,
            },
        );
    }

    transitionFulfillmentToState(id: string, state: string) {
        return this.baseDataService.mutate<
            TransitionFulfillmentToState.Mutation,
            TransitionFulfillmentToState.Variables
        >(TRANSITION_FULFILLMENT_TO_STATE, {
            id,
            state,
        });
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

    updateOrderNote(input: UpdateOrderNoteInput) {
        return this.baseDataService.mutate<UpdateOrderNote.Mutation, UpdateOrderNote.Variables>(
            UPDATE_ORDER_NOTE,
            {
                input,
            },
        );
    }

    deleteOrderNote(id: string) {
        return this.baseDataService.mutate<DeleteOrderNote.Mutation, DeleteOrderNote.Variables>(
            DELETE_ORDER_NOTE,
            {
                id,
            },
        );
    }

    transitionToState(id: string, state: string) {
        return this.baseDataService.mutate<TransitionOrderToState.Mutation, TransitionOrderToState.Variables>(
            TRANSITION_ORDER_TO_STATE,
            {
                id,
                state,
            },
        );
    }

    updateOrderCustomFields(input: UpdateOrderInput) {
        return this.baseDataService.mutate<
            UpdateOrderCustomFields.Mutation,
            UpdateOrderCustomFields.Variables
        >(UPDATE_ORDER_CUSTOM_FIELDS, {
            input,
        });
    }

    getOrderSummary(start: Date, end: Date) {
        return this.baseDataService.query<GetOrderSummary.Query, GetOrderSummary.Variables>(
            GET_ORDER_SUMMARY,
            {
                start: start.toISOString(),
                end: end.toISOString(),
            },
        );
    }
}
