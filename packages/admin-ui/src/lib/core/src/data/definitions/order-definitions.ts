import gql from 'graphql-tag';

export const ADJUSTMENT_FRAGMENT = gql`
    fragment Adjustment on Adjustment {
        adjustmentSource
        amount
        description
        type
    }
`;

export const REFUND_FRAGMENT = gql`
    fragment Refund on Refund {
        id
        state
        items
        shipping
        adjustment
        transactionId
        paymentId
    }
`;

export const SHIPPING_ADDRESS_FRAGMENT = gql`
    fragment ShippingAddress on OrderAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
    }
`;

export const ORDER_FRAGMENT = gql`
    fragment Order on Order {
        id
        createdAt
        updatedAt
        code
        state
        total
        currencyCode
        customer {
            id
            firstName
            lastName
        }
    }
`;

export const FULFILLMENT_FRAGMENT = gql`
    fragment Fulfillment on Fulfillment {
        id
        createdAt
        updatedAt
        method
        trackingCode
    }
`;

export const ORDER_LINE_FRAGMENT = gql`
    fragment OrderLine on OrderLine {
        id
        featuredAsset {
            preview
        }
        productVariant {
            id
            name
            sku
        }
        adjustments {
            ...Adjustment
        }
        unitPrice
        unitPriceWithTax
        quantity
        items {
            id
            unitPrice
            unitPriceIncludesTax
            unitPriceWithTax
            taxRate
            refundId
            cancelled
            fulfillment {
                ...Fulfillment
            }
        }
        totalPrice
    }
`;

export const ORDER_DETAIL_FRAGMENT = gql`
    fragment OrderDetail on Order {
        id
        createdAt
        updatedAt
        code
        state
        active
        customer {
            id
            firstName
            lastName
        }
        lines {
            ...OrderLine
        }
        adjustments {
            ...Adjustment
        }
        promotions {
            id
            couponCode
        }
        subTotal
        subTotalBeforeTax
        totalBeforeTax
        currencyCode
        shipping
        shippingWithTax
        shippingMethod {
            id
            code
            description
        }
        shippingAddress {
            ...ShippingAddress
        }
        payments {
            id
            createdAt
            transactionId
            amount
            method
            state
            metadata
            refunds {
                id
                createdAt
                state
                items
                adjustment
                total
                paymentId
                reason
                transactionId
                method
                metadata
                orderItems {
                    id
                }
            }
        }
        fulfillments {
            ...Fulfillment
        }
        total
    }
    ${ADJUSTMENT_FRAGMENT}
    ${SHIPPING_ADDRESS_FRAGMENT}
    ${FULFILLMENT_FRAGMENT}
    ${ORDER_LINE_FRAGMENT}
`;

export const GET_ORDERS_LIST = gql`
    query GetOrderList($options: OrderListOptions) {
        orders(options: $options) {
            items {
                ...Order
            }
            totalItems
        }
    }
    ${ORDER_FRAGMENT}
`;

export const GET_ORDER = gql`
    query GetOrder($id: ID!) {
        order(id: $id) {
            ...OrderDetail
        }
    }
    ${ORDER_DETAIL_FRAGMENT}
`;

export const SETTLE_PAYMENT = gql`
    mutation SettlePayment($id: ID!) {
        settlePayment(id: $id) {
            id
            transactionId
            amount
            method
            state
            metadata
        }
    }
`;

export const CREATE_FULFILLMENT = gql`
    mutation CreateFulfillment($input: FulfillOrderInput!) {
        fulfillOrder(input: $input) {
            ...Fulfillment
        }
    }
    ${FULFILLMENT_FRAGMENT}
`;

export const CANCEL_ORDER = gql`
    mutation CancelOrder($input: CancelOrderInput!) {
        cancelOrder(input: $input) {
            ...OrderDetail
        }
    }
    ${ORDER_DETAIL_FRAGMENT}
`;

export const REFUND_ORDER = gql`
    mutation RefundOrder($input: RefundOrderInput!) {
        refundOrder(input: $input) {
            ...Refund
        }
    }
    ${REFUND_FRAGMENT}
`;

export const SETTLE_REFUND = gql`
    mutation SettleRefund($input: SettleRefundInput!) {
        settleRefund(input: $input) {
            ...Refund
        }
    }
    ${REFUND_FRAGMENT}
`;

export const GET_ORDER_HISTORY = gql`
    query GetOrderHistory($id: ID!, $options: HistoryEntryListOptions) {
        order(id: $id) {
            id
            history(options: $options) {
                totalItems
                items {
                    id
                    type
                    createdAt
                    isPublic
                    administrator {
                        id
                        firstName
                        lastName
                    }
                    data
                }
            }
        }
    }
`;

export const ADD_NOTE_TO_ORDER = gql`
    mutation AddNoteToOrder($input: AddNoteToOrderInput!) {
        addNoteToOrder(input: $input) {
            id
        }
    }
`;
