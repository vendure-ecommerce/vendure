import { graphql } from '@/graphql/graphql.js';

export const promotionListDocument = graphql(`
    query PromotionList {
        promotions {
            items {
                id
                createdAt
                updatedAt
                name
                enabled
                description
                couponCode
                startsAt
                endsAt
                usageLimit
                perCustomerUsageLimit
            }
            totalItems
        }
    }
`);
