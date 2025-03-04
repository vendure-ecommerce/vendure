import { defineDashboardExtension } from '@vendure/dashboard';
import { ListPage } from '@vendure/dashboard';
import gql from 'graphql-tag';

export function Test() {
    return (
        <div>
            <ListPage></ListPage>
        </div>
    );
}

export default defineDashboardExtension({
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
});
