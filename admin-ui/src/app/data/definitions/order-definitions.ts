import gql from 'graphql-tag';

export const ADJUSTMENT_FRAGMENT = gql`
    fragment Adjustment on Adjustment {
        adjustmentSource
        amount
        description
        type
    }
`;

export const SHIPPING_ADDRESS_FRAGMENT = gql`
    fragment ShippingAddress on ShippingAddress {
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
        customer {
            id
            firstName
            lastName
        }
    }
`;

export const ORDER_WITH_LINES_FRAGMENT = gql`
    fragment OrderWithLines on Order {
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
            id
            featuredAsset {
                preview
            }
            productVariant {
                id
                name
                sku
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
            }
            totalPrice
        }
        adjustments {
            ...Adjustment
        }
        subTotal
        subTotalBeforeTax
        totalBeforeTax
        shipping
        shippingMethod
        shippingAddress {
            ...ShippingAddress
        }
        payments {
            id
            amount
            method
            state
            metadata
        }
        total
    }
    ${ADJUSTMENT_FRAGMENT}
    ${SHIPPING_ADDRESS_FRAGMENT}
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
            ...OrderWithLines
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;
