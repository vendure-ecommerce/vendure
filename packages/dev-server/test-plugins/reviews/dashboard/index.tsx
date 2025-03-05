import { defineDashboardExtension } from '@vendure/dashboard';
import { test } from '@vendure/dashboard';
import gql from 'graphql-tag';

export function Test() {
    return <div>{test}</div>;
}

export default defineDashboardExtension({
    routes: [
        {
            id: 'review-list',
            title: 'Product Reviews',
            listQuery: gql`
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
            `,
        },
    ],
});
