import { DashboardRouteDefinition, DetailPageButton, ListPage } from '@vendure/dashboard';
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

export const reviewList: DashboardRouteDefinition = {
    id: 'review-list',
    navMenuItem: {
        sectionId: 'catalog',
        id: 'reviews',
        url: '/reviews',
        title: 'Product Reviews',
    },
    path: '/reviews',
    component: (route) => <ListPage title="Product Reviews" listQuery={getReviewList} route={route} defaultVisibility={{
        product: true,
        summary: true,
        rating: true,
        authorName: true,
    }}
    customizeColumns={{
        product: {
            header: 'Product',
            cell: ({ row }) => {
                return (
                    <DetailPageButton id={row.original.id} label={row.original.product.name} />
                );
            },
        },
        
    }}
    />,
};
