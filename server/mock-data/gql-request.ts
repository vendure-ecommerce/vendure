import { DocumentNode } from 'graphql';
import { request } from 'graphql-request';
import { print } from 'graphql/language/printer';

export class SimpleGraphQLClient {
    constructor(private apiUrl: string) {}

    request<T, V = Record<string, any>>(query: DocumentNode, variables: V): Promise<T> {
        const queryString = print(query);
        return request(this.apiUrl, queryString, variables);
    }
}
