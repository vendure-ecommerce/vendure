import { graphql } from '@/graphql/graphql.js';

export const sellerItemFragment = graphql(`
    fragment SellerItem on Seller {
        id
        createdAt
        updatedAt
        name
    }
`);

export const sellerListQuery = graphql(
    `
        query SellerList {
            sellers {
                items {
                    ...SellerItem
                }
                totalItems
            }
        }
    `,
    [sellerItemFragment],
);
