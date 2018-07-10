import gql from 'graphql-tag';

import { PRODUCT_OPTION_GROUP_FRAGMENT, PRODUCT_WITH_VARIANTS_FRAGMENT } from '../fragments/product-fragments';

export const UPDATE_PRODUCT = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
    	updateProduct(input: $input) {
    		...ProductWithVariants
    	}
    },
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const CREATE_PRODUCT_OPTION_GROUP = gql`
    mutation CreateProductOptionGroup($input: CreateProductOptionGroupInput!) {
        createProductOptionGroup(input: $input) {
            ...ProductOptionGroup
        }
    },
    ${PRODUCT_OPTION_GROUP_FRAGMENT}
`;

export const ADD_OPTION_GROUP_TO_PRODUCT = gql`
    mutation AddOptionGroupToProduct($productId: ID!, $optionGroupId: ID!) {
        addOptionGroupToProduct(productId: $productId, optionGroupId: $optionGroupId) {
            id
            optionGroups {
                id
                code
                options {
                    id
                    code
                }
            }
        }
    }
`;
