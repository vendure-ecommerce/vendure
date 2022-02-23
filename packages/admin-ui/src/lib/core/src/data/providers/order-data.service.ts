import * as Codegen from '../../common/generated-types';
import {
    ADD_MANUAL_PAYMENT_TO_ORDER,
    ADD_NOTE_TO_ORDER,
    CANCEL_ORDER,
    CREATE_FULFILLMENT,
    DELETE_ORDER_NOTE,
    GET_ORDER,
    GET_ORDERS_LIST,
    GET_ORDER_HISTORY,
    GET_ORDER_SUMMARY,
    MODIFY_ORDER,
    REFUND_ORDER,
    SETTLE_PAYMENT,
    SETTLE_REFUND,
    TRANSITION_FULFILLMENT_TO_STATE,
    TRANSITION_ORDER_TO_STATE,
    TRANSITION_PAYMENT_TO_STATE,
    UPDATE_ORDER_CUSTOM_FIELDS,
    UPDATE_ORDER_NOTE,
} from '../definitions/order-definitions';

import { BaseDataService } from './base-data.service';

export class OrderDataService {
    constructor(private baseDataService: BaseDataService) {}

    getOrders(options: Codegen.OrderListOptions = { take: 10 }) {
        return this.baseDataService.query<Codegen.GetOrderListQuery, Codegen.GetOrderListQueryVariables>(
            GET_ORDERS_LIST,
            {
                options,
            },
        );
    }

    getOrder(id: string) {
        return this.baseDataService.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(GET_ORDER, {
            id,
        });
    }

    getOrderHistory(id: string, options?: Codegen.HistoryEntryListOptions) {
        return this.baseDataService.query<
            Codegen.GetOrderHistoryQuery,
            Codegen.GetOrderHistoryQueryVariables
        >(GET_ORDER_HISTORY, {
            id,
            options,
        });
    }

    settlePayment(id: string) {
        return this.baseDataService.mutate<
            Codegen.SettlePaymentMutation,
            Codegen.SettlePaymentMutationVariables
        >(SETTLE_PAYMENT, {
            id,
        });
    }

    transitionPaymentToState(id: string, state: string) {
        return this.baseDataService.mutate<
            Codegen.TransitionPaymentToStateMutation,
            Codegen.TransitionPaymentToStateMutationVariables
        >(TRANSITION_PAYMENT_TO_STATE, {
            id,
            state,
        });
    }

    createFulfillment(input: Codegen.FulfillOrderInput) {
        return this.baseDataService.mutate<
            Codegen.CreateFulfillmentMutation,
            Codegen.CreateFulfillmentMutationVariables
        >(CREATE_FULFILLMENT, {
            input,
        });
    }

    transitionFulfillmentToState(id: string, state: string) {
        return this.baseDataService.mutate<
            Codegen.TransitionFulfillmentToStateMutation,
            Codegen.TransitionFulfillmentToStateMutationVariables
        >(TRANSITION_FULFILLMENT_TO_STATE, {
            id,
            state,
        });
    }

    cancelOrder(input: Codegen.CancelOrderInput) {
        return this.baseDataService.mutate<Codegen.CancelOrderMutation, Codegen.CancelOrderMutationVariables>(
            CANCEL_ORDER,
            {
                input,
            },
        );
    }

    refundOrder(input: Codegen.RefundOrderInput) {
        return this.baseDataService.mutate<Codegen.RefundOrderMutation, Codegen.RefundOrderMutationVariables>(
            REFUND_ORDER,
            {
                input,
            },
        );
    }

    settleRefund(input: Codegen.SettleRefundInput, orderId: string) {
        return this.baseDataService.mutate<
            Codegen.SettleRefundMutation,
            Codegen.SettleRefundMutationVariables
        >(SETTLE_REFUND, {
            input,
        });
    }

    addNoteToOrder(input: Codegen.AddNoteToOrderInput) {
        return this.baseDataService.mutate<
            Codegen.AddNoteToOrderMutation,
            Codegen.AddNoteToOrderMutationVariables
        >(ADD_NOTE_TO_ORDER, {
            input,
        });
    }

    updateOrderNote(input: Codegen.UpdateOrderNoteInput) {
        return this.baseDataService.mutate<
            Codegen.UpdateOrderNoteMutation,
            Codegen.UpdateOrderNoteMutationVariables
        >(UPDATE_ORDER_NOTE, {
            input,
        });
    }

    deleteOrderNote(id: string) {
        return this.baseDataService.mutate<
            Codegen.DeleteOrderNoteMutation,
            Codegen.DeleteOrderNoteMutationVariables
        >(DELETE_ORDER_NOTE, {
            id,
        });
    }

    transitionToState(id: string, state: string) {
        return this.baseDataService.mutate<
            Codegen.TransitionOrderToStateMutation,
            Codegen.TransitionOrderToStateMutationVariables
        >(TRANSITION_ORDER_TO_STATE, {
            id,
            state,
        });
    }

    updateOrderCustomFields(input: Codegen.UpdateOrderInput) {
        return this.baseDataService.mutate<
            Codegen.UpdateOrderCustomFieldsMutation,
            Codegen.UpdateOrderCustomFieldsMutationVariables
        >(UPDATE_ORDER_CUSTOM_FIELDS, {
            input,
        });
    }

    getOrderSummary(start: Date, end: Date) {
        return this.baseDataService.query<
            Codegen.GetOrderSummaryQuery,
            Codegen.GetOrderSummaryQueryVariables
        >(GET_ORDER_SUMMARY, {
            start: start.toISOString(),
            end: end.toISOString(),
        });
    }

    modifyOrder(input: Codegen.ModifyOrderInput) {
        return this.baseDataService.mutate<Codegen.ModifyOrderMutation, Codegen.ModifyOrderMutationVariables>(
            MODIFY_ORDER,
            {
                input,
            },
        );
    }

    addManualPaymentToOrder(input: Codegen.ManualPaymentInput) {
        return this.baseDataService.mutate<
            Codegen.AddManualPaymentMutation,
            Codegen.AddManualPaymentMutationVariables
        >(ADD_MANUAL_PAYMENT_TO_ORDER, { input });
    }
}
