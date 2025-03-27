import { assetFragment } from '@/graphql/fragments.js';
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
