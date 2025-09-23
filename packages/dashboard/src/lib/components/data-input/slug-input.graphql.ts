import { graphql } from '@/vdb/graphql/graphql.js';

export const slugForEntityDocument = graphql(`
    query SlugForEntity($input: SlugForEntityInput!) {
        slugForEntity(input: $input)
    }
`);
