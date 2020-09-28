import gql from 'graphql-tag';

export const TEST_ORDER_FRAGMENT = gql`
    fragment TestOrderFragment on Order {
        id
        code
        state
        active
        total
        couponCodes
        adjustments {
            adjustmentSource
            amount
            description
            type
        }
        lines {
            id
            quantity
            productVariant {
                id
            }
            adjustments {
                adjustmentSource
                amount
                description
                type
            }
        }
        shipping
        shippingMethod {
            id
            code
            description
        }
        customer {
            id
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

export const UPDATED_ORDER_FRAGMENT = gql`
    fragment UpdatedOrder on Order {
        id
        code
        state
        active
        total
        lines {
            id
            quantity
            productVariant {
                id
            }
            adjustments {
                adjustmentSource
                amount
                description
                type
            }
        }
        adjustments {
            adjustmentSource
            amount
            description
            type
        }
    }
`;

export const ADD_ITEM_TO_ORDER = gql`
    mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
        addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
            ...UpdatedOrder
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${UPDATED_ORDER_FRAGMENT}
`;
export const SEARCH_PRODUCTS_SHOP = gql`
    query SearchProductsShop($input: SearchInput!) {
        search(input: $input) {
            totalItems
            items {
                productId
                productName
                productPreview
                productVariantId
                productVariantName
                productVariantPreview
                sku
                collectionIds
                price {
                    ... on SinglePrice {
                        value
                    }
                    ... on PriceRange {
                        min
                        max
                    }
                }
            }
        }
    }
`;
export const REGISTER_ACCOUNT = gql`
    mutation Register($input: RegisterCustomerInput!) {
        registerCustomerAccount(input: $input) {
            ... on Success {
                success
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;

export const CURRENT_USER_FRAGMENT = gql`
    fragment CurrentUserShop on CurrentUser {
        id
        identifier
        channels {
            code
            token
            permissions
        }
    }
`;

export const VERIFY_EMAIL = gql`
    mutation Verify($password: String, $token: String!) {
        verifyCustomerAccount(password: $password, token: $token) {
            ...CurrentUserShop
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken($emailAddress: String!) {
        refreshCustomerVerification(emailAddress: $emailAddress) {
            ... on Success {
                success
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;
export const REQUEST_PASSWORD_RESET = gql`
    mutation RequestPasswordReset($identifier: String!) {
        requestPasswordReset(emailAddress: $identifier) {
            ... on Success {
                success
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;
export const RESET_PASSWORD = gql`
    mutation ResetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
            ...CurrentUserShop
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;
export const REQUEST_UPDATE_EMAIL_ADDRESS = gql`
    mutation RequestUpdateEmailAddress($password: String!, $newEmailAddress: String!) {
        requestUpdateCustomerEmailAddress(password: $password, newEmailAddress: $newEmailAddress) {
            ... on Success {
                success
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;
export const UPDATE_EMAIL_ADDRESS = gql`
    mutation UpdateEmailAddress($token: String!) {
        updateCustomerEmailAddress(token: $token) {
            ... on Success {
                success
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;
export const GET_ACTIVE_CUSTOMER = gql`
    query GetActiveCustomer {
        activeCustomer {
            id
            emailAddress
        }
    }
`;
export const CREATE_ADDRESS = gql`
    mutation CreateAddressShop($input: CreateAddressInput!) {
        createCustomerAddress(input: $input) {
            id
            streetLine1
            country {
                code
            }
        }
    }
`;
export const UPDATE_ADDRESS = gql`
    mutation UpdateAddressShop($input: UpdateAddressInput!) {
        updateCustomerAddress(input: $input) {
            streetLine1
            country {
                code
            }
        }
    }
`;
export const DELETE_ADDRESS = gql`
    mutation DeleteAddressShop($id: ID!) {
        deleteCustomerAddress(id: $id) {
            success
        }
    }
`;

export const UPDATE_CUSTOMER = gql`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            id
            firstName
            lastName
        }
    }
`;

export const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($old: String!, $new: String!) {
        updateCustomerPassword(currentPassword: $old, newPassword: $new) {
            ... on Success {
                success
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;

export const GET_ACTIVE_ORDER = gql`
    query GetActiveOrder {
        activeOrder {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const ADJUST_ITEM_QUANTITY = gql`
    mutation AdjustItemQuantity($orderLineId: ID!, $quantity: Int!) {
        adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
            ...TestOrderFragment
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const REMOVE_ITEM_FROM_ORDER = gql`
    mutation RemoveItemFromOrder($orderLineId: ID!) {
        removeOrderLine(orderLineId: $orderLineId) {
            ...TestOrderFragment
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
            price
            description
        }
    }
`;

export const SET_SHIPPING_METHOD = gql`
    mutation SetShippingMethod($id: ID!) {
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

export const ACTIVE_ORDER_CUSTOMER = gql`
    fragment ActiveOrderCustomer on Order {
        id
        customer {
            id
            emailAddress
            firstName
            lastName
        }
        lines {
            id
        }
    }
`;

export const SET_CUSTOMER = gql`
    mutation SetCustomerForOrder($input: CreateCustomerInput!) {
        setCustomerForOrder(input: $input) {
            ...ActiveOrderCustomer
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ACTIVE_ORDER_CUSTOMER}
`;

export const GET_ORDER_BY_CODE = gql`
    query GetOrderByCode($code: String!) {
        orderByCode(code: $code) {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const GET_ORDER_PROMOTIONS_BY_CODE = gql`
    query GetOrderPromotionsByCode($code: String!) {
        orderByCode(code: $code) {
            ...TestOrderFragment
            promotions {
                id
                name
            }
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const GET_AVAILABLE_COUNTRIES = gql`
    query GetAvailableCountries {
        availableCountries {
            id
            code
        }
    }
`;

export const TRANSITION_TO_STATE = gql`
    mutation TransitionToState($state: String!) {
        transitionOrderToState(state: $state) {
            ...TestOrderFragment
            ... on OrderStateTransitionError {
                errorCode
                message
                transitionError
                fromState
                toState
            }
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const SET_SHIPPING_ADDRESS = gql`
    mutation SetShippingAddress($input: CreateAddressInput!) {
        setOrderShippingAddress(input: $input) {
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
        }
    }
`;

export const SET_BILLING_ADDRESS = gql`
    mutation SetBillingAddress($input: CreateAddressInput!) {
        setOrderBillingAddress(input: $input) {
            billingAddress {
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
        }
    }
`;

export const TEST_ORDER_WITH_PAYMENTS_FRAGMENT = gql`
    fragment TestOrderWithPayments on Order {
        ...TestOrderFragment
        payments {
            id
            transactionId
            method
            amount
            state
            metadata
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const GET_ACTIVE_ORDER_WITH_PAYMENTS = gql`
    query GetActiveOrderWithPayments {
        activeOrder {
            ...TestOrderWithPayments
        }
    }
    ${TEST_ORDER_WITH_PAYMENTS_FRAGMENT}
`;

export const ADD_PAYMENT = gql`
    mutation AddPaymentToOrder($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
            ...TestOrderWithPayments
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
        }
    }
    ${TEST_ORDER_WITH_PAYMENTS_FRAGMENT}
`;

export const GET_ACTIVE_ORDER_PAYMENTS = gql`
    query GetActiveOrderPayments {
        activeOrder {
            id
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
`;

export const GET_NEXT_STATES = gql`
    query GetNextOrderStates {
        nextOrderStates
    }
`;

export const GET_ACTIVE_ORDER_ADDRESSES = gql`
    query GetCustomerAddresses {
        activeOrder {
            customer {
                addresses {
                    id
                    streetLine1
                }
            }
        }
    }
`;

export const GET_ACTIVE_ORDER_ORDERS = gql`
    query GetCustomerOrders {
        activeOrder {
            customer {
                orders {
                    items {
                        id
                    }
                }
            }
        }
    }
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

export const REMOVE_COUPON_CODE = gql`
    mutation RemoveCouponCode($couponCode: String!) {
        removeCouponCode(couponCode: $couponCode) {
            ...TestOrderFragment
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;

export const REMOVE_ALL_ORDER_LINES = gql`
    mutation RemoveAllOrderLines {
        removeAllOrderLines {
            ...TestOrderFragment
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;
