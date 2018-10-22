import gql from 'graphql-tag';

export const ADJUSTMENT_FRAGMENT = gql`
    fragment Adjustment on Adjustment {
        adjustmentSource
        amount
        description
        type
    }
`;

export const ORDER_FRAGMENT = gql`
    fragment Order on Order {
        id
        createdAt
        updatedAt
        code
        total
        customer {
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
        customer {
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
        total
    }
    ${ADJUSTMENT_FRAGMENT}
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
