import type { introspection } from './graphql-env.d.ts';
import { initGraphQLTada } from 'gql.tada';

export const graphql = initGraphQLTada<{
    disableMasking: true;
    introspection: introspection;
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
