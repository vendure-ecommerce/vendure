import gql from 'graphql-tag';

import { graphql } from './graphql-admin';

export const searchProductsAdminDocument = graphql(`
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
`);

export const getOrderWithSellerOrdersDocument = gql`
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

export const disableProductDocument = graphql(`
    mutation DisableProduct($id: ID!) {
        updateProduct(input: { id: $id, enabled: false }) {
            id
        }
    }
`);
