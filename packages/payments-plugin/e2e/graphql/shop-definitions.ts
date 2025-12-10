import { testOrderFragment } from './fragments-shop';
import { graphql } from './graphql-shop';

export { testOrderFragment };

export const addPaymentDocument = graphql(
    `
        mutation AddPaymentToOrder($input: PaymentInput!) {
            addPaymentToOrder(input: $input) {
                ...TestOrderFragment
                ... on ErrorResult {
                    errorCode
                    message
                }
                ... on PaymentDeclinedError {
                    paymentErrorMessage
                }
                ... on PaymentFailedError {
                    paymentErrorMessage
                }
                ... on OrderStateTransitionError {
                    transitionError
                }
                ... on IneligiblePaymentMethodError {
                    eligibilityCheckerMessage
                }
            }
        }
    `,
    [testOrderFragment],
);

export const setShippingAddressDocument = graphql(
    `
        mutation SetShippingAddress($input: CreateAddressInput!) {
            setOrderShippingAddress(input: $input) {
                ... on Order {
                    ...TestOrderFragment
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [testOrderFragment],
);

export const getEligibleShippingMethodsDocument = graphql(`
    query GetShippingMethods {
        eligibleShippingMethods {
            id
            code
            price
            name
            description
        }
    }
`);

export const transitionToStateDocument = graphql(`
    mutation TransitionToState($state: String!) {
        transitionOrderToState(state: $state) {
            ... on Order {
                id
            }
            ... on OrderStateTransitionError {
                errorCode
                message
                transitionError
                fromState
                toState
            }
        }
    }
`);

export const setShippingMethodDocument = graphql(
    `
        mutation SetShippingMethod($id: [ID!]!) {
            setOrderShippingMethod(shippingMethodId: $id) {
                ...TestOrderFragment
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [testOrderFragment],
);

export const addItemToOrderDocument = graphql(
    `
        mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
            addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
                ...TestOrderFragment
                ... on ErrorResult {
                    errorCode
                    message
                }
                ... on InsufficientStockError {
                    quantityAvailable
                    order {
                        ...TestOrderFragment
                    }
                }
            }
        }
    `,
    [testOrderFragment],
);

export const adjustOrderLineDocument = graphql(
    `
        mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
            adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
                ...TestOrderFragment
                ... on ErrorResult {
                    errorCode
                    message
                }
                ... on InsufficientStockError {
                    quantityAvailable
                    order {
                        ...TestOrderFragment
                    }
                }
                ... on OrderInterceptorError {
                    interceptorError
                }
            }
        }
    `,
    [testOrderFragment],
);

export const getOrderByCodeDocument = graphql(
    `
        query GetOrderByCode($code: String!) {
            orderByCode(code: $code) {
                ...TestOrderFragment
            }
        }
    `,
    [testOrderFragment],
);

export const getActiveOrderDocument = graphql(
    `
        query GetActiveOrder {
            activeOrder {
                ...TestOrderFragment
            }
        }
    `,
    [testOrderFragment],
);

export const applyCouponCodeDocument = graphql(
    `
        mutation ApplyCouponCode($couponCode: String!) {
            applyCouponCode(couponCode: $couponCode) {
                ...TestOrderFragment
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [testOrderFragment],
);
