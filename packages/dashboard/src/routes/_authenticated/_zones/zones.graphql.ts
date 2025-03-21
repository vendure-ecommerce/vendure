import { graphql } from '@/graphql/graphql.js';

export const zoneItemFragment = graphql(`
    fragment ZoneItem on Zone {
        id
        createdAt
        updatedAt
        name
    }
`);

export const zoneListQuery = graphql(
    `
        query ZoneList {
            zones {
                items {
                    ...ZoneItem
                }
                totalItems
            }
        }
    `,
    [zoneItemFragment],
);

export const zoneMembersQuery = graphql(`
    query ZoneMembers($zoneId: ID!) {
        zone(id: $zoneId) {
            id
            createdAt
            updatedAt
            name
            members {
                createdAt
                updatedAt
                id
                name
                code
                enabled
            }
        }
    }
`);
