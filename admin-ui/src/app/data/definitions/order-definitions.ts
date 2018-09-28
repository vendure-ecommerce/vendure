import gql from 'graphql-tag';

export const ORDER_FRAGMENT = gql`
    fragment Order on Order {
        id
        createdAt
        updatedAt
        code
        customer {
            firstName
            lastName
        }
    }
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
