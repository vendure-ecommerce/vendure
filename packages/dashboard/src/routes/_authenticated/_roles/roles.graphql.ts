import { graphql } from '@/graphql/graphql.js';

export const roleItemFragment = graphql(`
    fragment RoleItem on Role {
        id
        createdAt
        updatedAt
        code
        description
        permissions
        channels {
            id
            code
            token
        }
    }
`);

export const roleListQuery = graphql(
    `
        query RoleList {
            roles {
                items {
                    ...RoleItem
                }
                totalItems
            }
        }
    `,
    [roleItemFragment],
);
