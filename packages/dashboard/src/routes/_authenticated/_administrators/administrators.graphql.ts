import { graphql } from '@/graphql/graphql.js';

export const administratorItemFragment = graphql(`
    fragment AdministratorItem on Administrator {
        id
        createdAt
        updatedAt
        firstName
        lastName
        emailAddress
        user {
            id
            identifier
            lastLogin
            roles {
                id
                createdAt
                updatedAt
                code
                description
            }
        }
    }
`);

export const administratorListQuery = graphql(
    `
        query AdministratorList {
            administrators {
                items {
                    ...AdministratorItem
                }
                totalItems
            }
        }
    `,
    [administratorItemFragment],
);
