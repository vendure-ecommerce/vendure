import gql from 'graphql-tag';

export const SEARCH_PRODUCTS_ADMIN = gql`
    query SearchProductsAdmin($input: SearchInput!) {
        search(input: $input) {
            totalItems
            items {
                enabled
                productId
                productName
                slug
                description
                productVariantId
                productVariantName
                sku
            }
        }
    }
`;

export const GET_ORDER_WITH_SELLER_ORDERS = gql`
    query GetOrderWithSellerOrders($id: ID!) {
        order(id: $id) {
            id
            code
            state
            sellerOrders {
                id
                aggregateOrderId
                lines {
                    id
                    productVariant {
                        id
                        name
                    }
                }
                shippingLines {
                    id
                    shippingMethod {
                        id
                        code
                    }
                }
            }
            lines {
                id
                productVariant {
                    id
                    name
                }
            }
            shippingLines {
                id
                shippingMethod {
                    id
                    code
                }
            }
        }
    }
`;
