import gql from 'graphql-tag';

export const TEST_ORDER_FRAGMENT = gql`
    fragment TestOrderFragment on Order {
        id
        code
        state
        active
        subTotal
        subTotalWithTax
        shipping
        shippingWithTax
        total
        totalWithTax
        currencyCode
        couponCodes
        discounts {
            adjustmentSource
            amount
            amountWithTax
            description
            type
        }
        payments {
            id
            transactionId
            method
            amount
            state
            metadata
        }
        lines {
            id
            quantity
            linePrice
            linePriceWithTax
            unitPrice
            unitPriceWithTax
            unitPriceChangeSinceAdded
            unitPriceWithTaxChangeSinceAdded
            proratedUnitPriceWithTax
            productVariant {
                id
            }
            discounts {
                adjustmentSource
                amount
                amountWithTax
                description
                type
            }
        }
        shippingAddress {
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
        shippingLines {
            shippingMethod {
                id
                code
                description
            }
        }
        customer {
            id
            emailAddress
            user {
                id
                identifier
            }
        }
        history {
            items {
                id
                type
                data
            }
        }
    }
`;

export const ADD_PAYMENT = gql`
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
    ${TEST_ORDER_FRAGMENT}
`;

export const SET_SHIPPING_ADDRESS = gql`
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
    ${TEST_ORDER_FRAGMENT}
`;

export const GET_ELIGIBLE_SHIPPING_METHODS = gql`
    query GetShippingMethods {
        eligibleShippingMethods {
            id
            code
            price
            name
            description
        }
    }
`;

export const TRANSITION_TO_STATE = gql`
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
`;

export const SET_SHIPPING_METHOD = gql`
    mutation SetShippingMethod($id: [ID!]!) {
        setOrderShippingMethod(shippingMethodId: $id) {
            ...TestOrderFragment
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const ADD_ITEM_TO_ORDER = gql`
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
    ${TEST_ORDER_FRAGMENT}
`;

export const ADJUST_ORDER_LINE = gql`
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
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const GET_ORDER_BY_CODE = gql`
    query GetOrderByCode($code: String!) {
        orderByCode(code: $code) {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const GET_ACTIVE_ORDER = gql`
    query GetActiveOrder {
        activeOrder {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const APPLY_COUPON_CODE = gql`
    mutation ApplyCouponCode($couponCode: String!) {
        applyCouponCode(couponCode: $couponCode) {
            ...TestOrderFragment
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;
