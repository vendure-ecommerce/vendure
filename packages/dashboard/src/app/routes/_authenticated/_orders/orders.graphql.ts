import { assetFragment, errorResultFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';
import { gql } from 'awesome-graphql-client';

export const orderListDocument = graphql(`
    query GetOrders($options: OrderListOptions) {
        orders(options: $options) {
            items {
                id
                createdAt
                updatedAt
                type
                code
                state
                customer {
                    id
                    firstName
                    lastName
                }
                orderPlacedAt
                total
                totalWithTax
                currencyCode

                shippingLines {
                    shippingMethod {
                        name
                    }
                }
            }
            totalItems
        }
    }
`);

export const discountFragment = graphql(`
    fragment Discount on Discount {
        adjustmentSource
        amount
        amountWithTax
        description
        type
    }
`);

export const paymentFragment = graphql(`
    fragment Payment on Payment {
        id
        createdAt
        transactionId
        amount
        method
        state
        metadata
    }
`);

export const refundFragment = graphql(`
    fragment Refund on Refund {
        id
        state
        items
        shipping
        adjustment
        transactionId
        paymentId
    }
`);

export const orderAddressFragment = graphql(`
    fragment OrderAddress on OrderAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        countryCode
        phoneNumber
    }
`);

export const fulfillmentFragment = graphql(`
    fragment Fulfillment on Fulfillment {
        id
        state
        nextStates
        createdAt
        updatedAt
        method
        lines {
            orderLineId
            quantity
        }
        trackingCode
    }
`);

export const paymentWithRefundsFragment = graphql(`
    fragment PaymentWithRefunds on Payment {
        id
        createdAt
        transactionId
        amount
        method
        state
        nextStates
        errorMessage
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
            lines {
                orderLineId
                quantity
            }
        }
    }
`);

export const orderLineFragment = graphql(
    `
        fragment OrderLine on OrderLine {
            id
            createdAt
            updatedAt
            featuredAsset {
                ...Asset
            }
            productVariant {
                id
                name
                sku
                trackInventory
                stockOnHand
            }
            discounts {
                ...Discount
            }
            fulfillmentLines {
                fulfillmentId
                quantity
            }
            unitPrice
            unitPriceWithTax
            proratedUnitPrice
            proratedUnitPriceWithTax
            quantity
            orderPlacedQuantity
            linePrice
            lineTax
            linePriceWithTax
            discountedLinePrice
            discountedLinePriceWithTax
            customFields
        }
    `,
    [assetFragment],
);

export const orderDetailFragment = graphql(
    `
        fragment OrderDetail on Order {
            id
            createdAt
            updatedAt
            type
            aggregateOrder {
                id
                code
            }
            sellerOrders {
                id
                code
                channels {
                    id
                    code
                }
            }
            code
            state
            nextStates
            active
            couponCodes
            customer {
                id
                firstName
                lastName
            }
            lines {
                ...OrderLine
            }
            surcharges {
                id
                sku
                description
                price
                priceWithTax
                taxRate
            }
            discounts {
                ...Discount
            }
            promotions {
                id
                couponCode
                name
            }
            subTotal
            subTotalWithTax
            total
            totalWithTax
            currencyCode
            shipping
            shippingWithTax
            shippingLines {
                id
                discountedPriceWithTax
                shippingMethod {
                    id
                    code
                    name
                    fulfillmentHandlerCode
                    description
                }
            }
            taxSummary {
                description
                taxBase
                taxRate
                taxTotal
            }
            shippingAddress {
                ...OrderAddress
            }
            billingAddress {
                ...OrderAddress
            }
            payments {
                ...PaymentWithRefunds
            }
            fulfillments {
                ...Fulfillment
            }
            modifications {
                id
                createdAt
                isSettled
                priceChange
                note
                payment {
                    id
                    amount
                }
                lines {
                    orderLineId
                    quantity
                }
                refund {
                    id
                    paymentId
                    total
                }
                surcharges {
                    id
                }
            }
        }
    `,
    [
        discountFragment,
        orderAddressFragment,
        fulfillmentFragment,
        orderLineFragment,
        paymentWithRefundsFragment,
    ],
);

export const orderDetailDocument = graphql(
    `
        query GetOrder($id: ID!) {
            order(id: $id) {
                ...OrderDetail
                customFields
            }
        }
    `,
    [orderDetailFragment],
);

export const orderHistoryDocument = graphql(`
    query GetOrderHistory($id: ID!, $options: HistoryEntryListOptions) {
        order(id: $id) {
            id
            createdAt
            updatedAt
            code
            currencyCode
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
`);

export const createDraftOrderDocument = graphql(`
    mutation CreateDraftOrder {
        createDraftOrder {
            id
        }
    }
`);

export const deleteDraftOrderDocument = graphql(`
    mutation DeleteDraftOrder($orderId: ID!) {
        deleteDraftOrder(orderId: $orderId) {
            result
            message
        }
    }
`);

export const addItemToDraftOrderDocument = graphql(
    `
        mutation AddItemToDraftOrder($orderId: ID!, $input: AddItemToDraftOrderInput!) {
            addItemToDraftOrder(orderId: $orderId, input: $input) {
                __typename
                ... on Order {
                    id
                }
                ...ErrorResult
            }
        }
    `,
    [errorResultFragment],
);

export const adjustDraftOrderLineDocument = graphql(
    `
        mutation AdjustDraftOrderLine($orderId: ID!, $input: AdjustDraftOrderLineInput!) {
            adjustDraftOrderLine(orderId: $orderId, input: $input) {
                __typename
                ... on Order {
                    id
                }
                ...ErrorResult
            }
        }
    `,
    [errorResultFragment],
);

export const removeDraftOrderLineDocument = graphql(
    `
        mutation RemoveDraftOrderLine($orderId: ID!, $orderLineId: ID!) {
            removeDraftOrderLine(orderId: $orderId, orderLineId: $orderLineId) {
                __typename
                ... on Order {
                    id
                }
                ...ErrorResult
            }
        }
    `,
    [errorResultFragment],
);

export const setCustomerForDraftOrderDocument = graphql(
    `
        mutation SetCustomerForDraftOrder($orderId: ID!, $customerId: ID, $input: CreateCustomerInput) {
            setCustomerForDraftOrder(orderId: $orderId, customerId: $customerId, input: $input) {
                __typename
                ... on Order {
                    id
                }
                ...ErrorResult
            }
        }
    `,
    [errorResultFragment],
);

export const setShippingAddressForDraftOrderDocument = graphql(`
    mutation SetDraftOrderShippingAddress($orderId: ID!, $input: CreateAddressInput!) {
        setDraftOrderShippingAddress(orderId: $orderId, input: $input) {
            id
        }
    }
`);

export const setBillingAddressForDraftOrderDocument = graphql(`
    mutation SetDraftOrderBillingAddress($orderId: ID!, $input: CreateAddressInput!) {
        setDraftOrderBillingAddress(orderId: $orderId, input: $input) {
            id
        }
    }
`);

export const unsetShippingAddressForDraftOrderDocument = graphql(`
    mutation UnsetDraftOrderShippingAddress($orderId: ID!) {
        unsetDraftOrderShippingAddress(orderId: $orderId) {
            id
        }
    }
`);

export const unsetBillingAddressForDraftOrderDocument = graphql(`
    mutation UnsetDraftOrderBillingAddress($orderId: ID!) {
        unsetDraftOrderBillingAddress(orderId: $orderId) {
            id
        }
    }
`);

export const applyCouponCodeToDraftOrderDocument = graphql(
    `
        mutation ApplyCouponCodeToDraftOrder($orderId: ID!, $couponCode: String!) {
            applyCouponCodeToDraftOrder(orderId: $orderId, couponCode: $couponCode) {
                __typename
                ... on Order {
                    id
                }
                ...ErrorResult
            }
        }
    `,
    [errorResultFragment],
);

export const removeCouponCodeFromDraftOrderDocument = graphql(`
    mutation RemoveCouponCodeFromDraftOrder($orderId: ID!, $couponCode: String!) {
        removeCouponCodeFromDraftOrder(orderId: $orderId, couponCode: $couponCode) {
            id
        }
    }
`);

export const draftOrderEligibleShippingMethodsDocument = graphql(`
    query DraftOrderEligibleShippingMethods($orderId: ID!) {
        eligibleShippingMethodsForDraftOrder(orderId: $orderId) {
            id
            name
            code
            description
            price
            priceWithTax
            metadata
        }
    }
`);

export const setDraftOrderShippingMethodDocument = graphql(
    `
        mutation SetDraftOrderShippingMethod($orderId: ID!, $shippingMethodId: ID!) {
            setDraftOrderShippingMethod(orderId: $orderId, shippingMethodId: $shippingMethodId) {
                __typename
                ... on Order {
                    id
                }
                ...ErrorResult
            }
        }
    `,
    [errorResultFragment],
);

export const setDraftOrderCustomFieldsDocument = graphql(`
    mutation SetDraftOrderCustomFields($orderId: ID!, $input: UpdateOrderInput!) {
        setDraftOrderCustomFields(orderId: $orderId, input: $input) {
            id
        }
    }
`);

export const transitionOrderToStateDocument = graphql(
    `
        mutation TransitionOrderToState($id: ID!, $state: String!) {
            transitionOrderToState(id: $id, state: $state) {
                __typename
                ... on Order {
                    id
                }
                ...ErrorResult
            }
        }
    `,
    [errorResultFragment],
);
