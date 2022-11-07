import {
    AddItemToDraftOrderInput,
    AddItemToDraftOrderMutation,
    AddItemToDraftOrderMutationVariables,
    AddManualPayment,
    AddNoteToOrder,
    AddNoteToOrderInput,
    AdjustDraftOrderLineInput,
    AdjustDraftOrderLineMutation,
    AdjustDraftOrderLineMutationVariables,
    ApplyCouponCodeToDraftOrderMutation,
    ApplyCouponCodeToDraftOrderMutationVariables,
    CancelOrder,
    CancelOrderInput,
    CancelPayment,
    CreateAddressInput,
    CreateCustomerInput,
    CreateDraftOrderMutation,
    CreateDraftOrderMutationVariables,
    CreateFulfillment,
    DeleteDraftOrderMutation,
    DeleteDraftOrderMutationVariables,
    DeleteOrderNote,
    DraftOrderEligibleShippingMethodsQuery,
    DraftOrderEligibleShippingMethodsQueryVariables,
    FulfillOrderInput,
    GetOrder,
    GetOrderHistory,
    GetOrderList,
    GetOrderSummary,
    HistoryEntryListOptions,
    ManualPaymentInput,
    ModifyOrder,
    ModifyOrderInput,
    OrderListOptions,
    RefundOrder,
    RefundOrderInput,
    RemoveCouponCodeFromDraftOrderMutation,
    RemoveCouponCodeFromDraftOrderMutationVariables,
    RemoveDraftOrderLineMutation,
    RemoveDraftOrderLineMutationVariables,
    SetCustomerForDraftOrderMutation,
    SetCustomerForDraftOrderMutationVariables,
    SetDraftOrderBillingAddressMutation,
    SetDraftOrderBillingAddressMutationVariables,
    SetDraftOrderShippingAddressMutation,
    SetDraftOrderShippingAddressMutationVariables,
    SetDraftOrderShippingMethodMutation,
    SetDraftOrderShippingMethodMutationVariables,
    SettlePayment,
    SettleRefund,
    SettleRefundInput,
    TransitionFulfillmentToState,
    TransitionOrderToState,
    TransitionPaymentToState,
    UpdateOrderCustomFields,
    UpdateOrderInput,
    UpdateOrderNote,
    UpdateOrderNoteInput,
} from '../../common/generated-types';
import {
    ADD_ITEM_TO_DRAFT_ORDER,
    ADD_MANUAL_PAYMENT_TO_ORDER,
    ADD_NOTE_TO_ORDER,
    ADJUST_DRAFT_ORDER_LINE,
    CANCEL_ORDER,
    CANCEL_PAYMENT,
    CREATE_DRAFT_ORDER,
    CREATE_FULFILLMENT,
    DELETE_ORDER_NOTE,
    GET_ORDER,
    GET_ORDERS_LIST,
    GET_ORDER_HISTORY,
    GET_ORDER_SUMMARY,
    MODIFY_ORDER,
    REFUND_ORDER,
    REMOVE_DRAFT_ORDER_LINE,
    SETTLE_PAYMENT,
    SETTLE_REFUND,
    SET_CUSTOMER_FOR_DRAFT_ORDER,
    TRANSITION_FULFILLMENT_TO_STATE,
    TRANSITION_ORDER_TO_STATE,
    TRANSITION_PAYMENT_TO_STATE,
    UPDATE_ORDER_CUSTOM_FIELDS,
    UPDATE_ORDER_NOTE,
    SET_SHIPPING_ADDRESS_FOR_DRAFT_ORDER,
    SET_BILLING_ADDRESS_FOR_DRAFT_ORDER,
    APPLY_COUPON_CODE_TO_DRAFT_ORDER,
    REMOVE_COUPON_CODE_FROM_DRAFT_ORDER,
    DRAFT_ORDER_ELIGIBLE_SHIPPING_METHODS,
    SET_DRAFT_ORDER_SHIPPING_METHOD,
    DELETE_DRAFT_ORDER,
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

    cancelPayment(id: string) {
        return this.baseDataService.mutate<CancelPayment.Mutation, CancelPayment.Variables>(CANCEL_PAYMENT, {
            id,
        });
    }

    transitionPaymentToState(id: string, state: string) {
        return this.baseDataService.mutate<
            TransitionPaymentToState.Mutation,
            TransitionPaymentToState.Variables
        >(TRANSITION_PAYMENT_TO_STATE, {
            id,
            state,
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

    modifyOrder(input: ModifyOrderInput) {
        return this.baseDataService.mutate<ModifyOrder.Mutation, ModifyOrder.Variables>(MODIFY_ORDER, {
            input,
        });
    }

    addManualPaymentToOrder(input: ManualPaymentInput) {
        return this.baseDataService.mutate<AddManualPayment.Mutation, AddManualPayment.Variables>(
            ADD_MANUAL_PAYMENT_TO_ORDER,
            { input },
        );
    }

    createDraftOrder() {
        return this.baseDataService.mutate<CreateDraftOrderMutation>(CREATE_DRAFT_ORDER);
    }

    deleteDraftOrder(orderId: string) {
        return this.baseDataService.mutate<DeleteDraftOrderMutation, DeleteDraftOrderMutationVariables>(
            DELETE_DRAFT_ORDER,
            { orderId },
        );
    }

    addItemToDraftOrder(orderId: string, input: AddItemToDraftOrderInput) {
        return this.baseDataService.mutate<AddItemToDraftOrderMutation, AddItemToDraftOrderMutationVariables>(
            ADD_ITEM_TO_DRAFT_ORDER,
            { orderId, input },
        );
    }

    adjustDraftOrderLine(orderId: string, input: AdjustDraftOrderLineInput) {
        return this.baseDataService.mutate<
            AdjustDraftOrderLineMutation,
            AdjustDraftOrderLineMutationVariables
        >(ADJUST_DRAFT_ORDER_LINE, { orderId, input });
    }

    removeDraftOrderLine(orderId: string, orderLineId: string) {
        return this.baseDataService.mutate<
            RemoveDraftOrderLineMutation,
            RemoveDraftOrderLineMutationVariables
        >(REMOVE_DRAFT_ORDER_LINE, { orderId, orderLineId });
    }

    setCustomerForDraftOrder(
        orderId: string,
        { customerId, input }: { customerId?: string; input?: CreateCustomerInput },
    ) {
        return this.baseDataService.mutate<
            SetCustomerForDraftOrderMutation,
            SetCustomerForDraftOrderMutationVariables
        >(SET_CUSTOMER_FOR_DRAFT_ORDER, { orderId, customerId, input });
    }

    setDraftOrderShippingAddress(orderId: string, input: CreateAddressInput) {
        return this.baseDataService.mutate<
            SetDraftOrderShippingAddressMutation,
            SetDraftOrderShippingAddressMutationVariables
        >(SET_SHIPPING_ADDRESS_FOR_DRAFT_ORDER, { orderId, input });
    }

    setDraftOrderBillingAddress(orderId: string, input: CreateAddressInput) {
        return this.baseDataService.mutate<
            SetDraftOrderBillingAddressMutation,
            SetDraftOrderBillingAddressMutationVariables
        >(SET_BILLING_ADDRESS_FOR_DRAFT_ORDER, { orderId, input });
    }

    applyCouponCodeToDraftOrder(orderId: string, couponCode: string) {
        return this.baseDataService.mutate<
            ApplyCouponCodeToDraftOrderMutation,
            ApplyCouponCodeToDraftOrderMutationVariables
        >(APPLY_COUPON_CODE_TO_DRAFT_ORDER, { orderId, couponCode });
    }

    removeCouponCodeFromDraftOrder(orderId: string, couponCode: string) {
        return this.baseDataService.mutate<
            RemoveCouponCodeFromDraftOrderMutation,
            RemoveCouponCodeFromDraftOrderMutationVariables
        >(REMOVE_COUPON_CODE_FROM_DRAFT_ORDER, { orderId, couponCode });
    }

    getDraftOrderEligibleShippingMethods(orderId: string) {
        return this.baseDataService.query<
            DraftOrderEligibleShippingMethodsQuery,
            DraftOrderEligibleShippingMethodsQueryVariables
        >(DRAFT_ORDER_ELIGIBLE_SHIPPING_METHODS, { orderId });
    }

    setDraftOrderShippingMethod(orderId: string, shippingMethodId: string) {
        return this.baseDataService.mutate<
            SetDraftOrderShippingMethodMutation,
            SetDraftOrderShippingMethodMutationVariables
        >(SET_DRAFT_ORDER_SHIPPING_METHOD, { orderId, shippingMethodId });
    }
}
