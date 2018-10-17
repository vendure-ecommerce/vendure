import gql from 'graphql-tag';

export const ADJUSTMENT_OPERATION_FRAGMENT = gql`
    fragment AdjustmentOperation on AdjustmentOperation {
        args {
            name
            type
            value
        }
        code
        description
    }
`;

export const PROMOTION_FRAGMENT = gql`
    fragment Promotion on Promotion {
        id
        createdAt
        updatedAt
        name
        enabled
        conditions {
            ...AdjustmentOperation
        }
        actions {
            ...AdjustmentOperation
        }
    }
    ${ADJUSTMENT_OPERATION_FRAGMENT}
`;

export const GET_PROMOTION_LIST = gql`
    query GetPromotionList($options: PromotionListOptions) {
        promotions(options: $options) {
            items {
                ...Promotion
            }
            totalItems
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const GET_PROMOTION = gql`
    query GetPromotion($id: ID!) {
        promotion(id: $id) {
            ...Promotion
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const GET_ADJUSTMENT_OPERATIONS = gql`
    query GetAdjustmentOperations {
        adjustmentOperations {
            actions {
                ...AdjustmentOperation
            }
            conditions {
                ...AdjustmentOperation
            }
        }
    }
    ${ADJUSTMENT_OPERATION_FRAGMENT}
`;

export const CREATE_PROMOTION = gql`
    mutation CreatePromotion($input: CreatePromotionInput!) {
        createPromotion(input: $input) {
            ...Promotion
        }
    }
    ${PROMOTION_FRAGMENT}
`;

export const UPDATE_PROMOTION = gql`
    mutation UpdatePromotion($input: UpdatePromotionInput!) {
        updatePromotion(input: $input) {
            ...Promotion
        }
    }
    ${PROMOTION_FRAGMENT}
`;
