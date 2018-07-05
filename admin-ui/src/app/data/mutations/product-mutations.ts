import gql from 'graphql-tag';
import { PRODUCT_WITH_VARIANTS_FRAGMENT } from '../fragments/product-fragments';

export const UPDATE_PRODUCT = gql`
    mutation UpdateProduct ($input: UpdateProductInput) {
    	updateProduct(input: $input) {
    		...ProductWithVariants
    	}
    },
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;
