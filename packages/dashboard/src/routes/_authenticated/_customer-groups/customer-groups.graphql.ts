import { graphql } from '@/graphql/graphql.js';

export const customerGroupListDocument = graphql(`
    query CustomerGroupList($options: CustomerGroupListOptions) {
        customerGroups(options: $options) {
            items {
                id
                createdAt
                updatedAt
                name
                customers {
                    totalItems
                }
            }
        }
    }
`);
