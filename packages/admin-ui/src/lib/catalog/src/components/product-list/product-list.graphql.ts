import { gql } from 'apollo-angular';

export const PRODUCT_LIST_QUERY = gql`
    query ProductListQuery($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                createdAt
                updatedAt
                enabled
                languageCode
                name
                slug
                featuredAsset {
                    id
                    createdAt
                    updatedAt
                    preview
                    focalPoint {
                        x
                        y
                    }
                }
                variantList {
                    totalItems
                }
            }
            totalItems
        }
    }
`;
