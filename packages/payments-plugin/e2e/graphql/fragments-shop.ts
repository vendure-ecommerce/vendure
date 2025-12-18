import { graphql } from './graphql-shop';

export const testOrderFragment = graphql(`
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
`);
