import { graphql } from '@/graphql/graphql.js';

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
