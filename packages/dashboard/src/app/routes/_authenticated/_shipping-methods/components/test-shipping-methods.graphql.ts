import { graphql } from '@/vdb/graphql/graphql.js';

export const testEligibleShippingMethodsDocument = graphql(`
    query TestEligibleShippingMethods($input: TestEligibleShippingMethodsInput!) {
        testEligibleShippingMethods(input: $input) {
            id
            name
            code
            description
            price
            priceWithTax
            metadata
        }
    }
`);
