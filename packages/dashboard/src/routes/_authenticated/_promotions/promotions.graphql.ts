import { configurableOperationFragment } from '@/graphql/fragments.js';
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

export const promotionDetailDocument = graphql(
    `
        query PromotionDetail($id: ID!) {
            promotion(id: $id) {
                id
                createdAt
                updatedAt
                name
                description
                enabled
                couponCode
                perCustomerUsageLimit
                usageLimit
                startsAt
                endsAt
                conditions {
                    ...ConfigurableOperation
                }
                actions {
                    ...ConfigurableOperation
                }
                translations {
                    id
                    languageCode
                    name
                    description
                }
                customFields
            }
        }
    `,
    [configurableOperationFragment],
);

export const createPromotionDocument = graphql(`
    mutation CreatePromotion($input: CreatePromotionInput!) {
        createPromotion(input: $input) {
            __typename
            ... on Promotion {
                id
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`);

export const updatePromotionDocument = graphql(`
    mutation UpdatePromotion($input: UpdatePromotionInput!) {
        updatePromotion(input: $input) {
            __typename
            ... on Promotion {
                id
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`);

export const deletePromotionDocument = graphql(`
    mutation DeletePromotion($id: ID!) {
        deletePromotion(id: $id) {
            result
            message
        }
    }
`);
