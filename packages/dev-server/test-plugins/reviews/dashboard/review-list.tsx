import { DashboardListRouteDefinition } from '@vendure/dashboard';
import gql from 'graphql-tag';

const getReviewList = gql`
    query GetProductReviews {
        productReviews {
            items {
                id
                createdAt
                updatedAt
                product {
                    id
                    name
                }
                productVariant {
                    id
                    name
                    sku
                }
                summary
                body
                rating
                authorName
                authorLocation
                upvotes
                downvotes
                state
                response
                responseCreatedAt
            }
        }
    }
`;

export const reviewList: DashboardListRouteDefinition = {
    id: 'review-list',
    title: 'Product Reviews!',
    path: '/reviews',
    navMenuItem: { sectionId: 'catalog' },
    defaultVisibility: {
        product: true,
        summary: true,
        rating: true,
        authorName: true,
    },
    listQuery: getReviewList,
};
