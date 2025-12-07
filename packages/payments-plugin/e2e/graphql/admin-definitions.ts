import { paymentMethodFragment, refundFragment } from './fragments-admin';
import { graphql } from './graphql-admin';

export const createPaymentMethodDocument = graphql(
    `
        mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
            createPaymentMethod(input: $input) {
                ...PaymentMethod
            }
        }
    `,
    [paymentMethodFragment],
);

export const getCustomerListDocument = graphql(`
    query GetCustomerList($options: CustomerListOptions) {
        customers(options: $options) {
            items {
                id
                title
                firstName
                lastName
                emailAddress
                phoneNumber
                user {
                    id
                    verified
                }
            }
            totalItems
        }
    }
`);

export const getOrderPaymentsDocument = graphql(`
    query order($id: ID!) {
        order(id: $id) {
            id
            state
            totalWithTax
            payments {
                id
                transactionId
                method
                amount
                state
                errorMessage
                metadata
            }
        }
    }
`);

export const refundOrderDocument = graphql(
    `
        mutation RefundOrder($input: RefundOrderInput!) {
            refundOrder(input: $input) {
                ...Refund
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [refundFragment],
);

export const createChannelDocument = graphql(`
    mutation CreateChannel($input: CreateChannelInput!) {
        createChannel(input: $input) {
            ... on Channel {
                id
                code
                token
                currencyCode
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`);

export const createCouponDocument = graphql(`
    mutation CreatePromotion($input: CreatePromotionInput!) {
        createPromotion(input: $input) {
            ... on ErrorResult {
                errorCode
            }
            __typename
        }
    }
`);
