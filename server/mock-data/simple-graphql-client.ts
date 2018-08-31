import { DocumentNode } from 'graphql';
import { request } from 'graphql-request';
import { print } from 'graphql/language/printer';

export interface GraphQlClient {
    query<T, V = Record<string, any>>(query: DocumentNode, variables: V): Promise<T>;
}

/**
 * A minimalistic GraphQL client for populating test data.
 */
export class SimpleGraphQLClient implements GraphQlClient {
    constructor(public apiUrl: string = '') {}

    query<T, V = Record<string, any>>(query: DocumentNode, variables: V): Promise<T> {
        const queryString = print(query);
        return request(this.apiUrl, queryString, variables);
    }
}
