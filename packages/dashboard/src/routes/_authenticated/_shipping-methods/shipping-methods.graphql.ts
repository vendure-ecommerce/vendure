import { graphql } from '@/graphql/graphql.js';

export const shippingMethodItemFragment = graphql(`
    fragment ShippingMethodItem on ShippingMethod {
        id
        name
        code
        description
        fulfillmentHandlerCode
        createdAt
        updatedAt
    }
`);

export const shippingMethodListQuery = graphql(
    `
        query ShippingMethodList {
            shippingMethods {
                items {
                    ...ShippingMethodItem
                }
                totalItems
            }
        }
    `,
    [shippingMethodItemFragment],
);
