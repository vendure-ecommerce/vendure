import gql from 'graphql-tag';

export const PAYMENT_METHOD_FRAGMENT = gql`
    fragment PaymentMethod on PaymentMethod {
        id
        code
        name
        description
        enabled
        checker {
            code
            args {
                name
                value
            }
        }
        handler {
            code
            args {
                name
                value
            }
        }
    }
`;

export const CREATE_PAYMENT_METHOD = gql`
    mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
        createPaymentMethod(input: $input) {
            ...PaymentMethod
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;

export const GET_CUSTOMER_LIST = gql`
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
`;

const REFUND_FRAGMENT = gql`
    fragment Refund on Refund {
        id
        state
        items
        transactionId
        shipping
        total
        metadata
    }
`;

export const REFUND_ORDER = gql`
    mutation RefundOrder($input: RefundOrderInput!) {
        refundOrder(input: $input) {
            ...Refund
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${REFUND_FRAGMENT}
`;
