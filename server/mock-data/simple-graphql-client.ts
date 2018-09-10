import { DocumentNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import { GraphQLError } from 'graphql-request/dist/src/types';
import { print } from 'graphql/language/printer';
import { AttemptLogin, AttemptLoginVariables } from 'shared/generated-types';

import { ATTEMPT_LOGIN } from '../../admin-ui/src/app/data/definitions/auth-definitions';
import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '../src/common/constants';
import { getConfig } from '../src/config/vendure-config';

// tslint:disable:no-console
/**
 * A minimalistic GraphQL client for populating and querying test data.
 */
export class SimpleGraphQLClient {
    private client: GraphQLClient;
    private authToken: string;
    private channelToken: string;

    constructor(apiUrl: string = '') {
        this.client = new GraphQLClient(apiUrl);
    }

    setAuthToken(token: string) {
        this.authToken = token;
        this.setHeaders();
    }

    setChannelToken(token: string) {
        this.channelToken = token;
        this.setHeaders();
    }

    query<T = any, V = Record<string, any>>(query: DocumentNode, variables?: V): Promise<T> {
        const queryString = print(query);
        return this.client.request(queryString, variables);
    }

    queryRaw<T = any, V = Record<string, any>>(
        query: DocumentNode,
        variables?: V,
    ): Promise<{
        data?: T;
        extensions?: any;
        headers: Record<string, string>;
        status: number;
        errors?: GraphQLError[];
    }> {
        const queryString = print(query);
        return this.client.rawRequest<T>(queryString, variables);
    }

    async queryStatus<T = any, V = Record<string, any>>(query: DocumentNode, variables?: V): Promise<number> {
        const queryString = print(query);
        const result = await this.client.rawRequest<T>(queryString, variables);
        return result.status;
    }

    async asUserWithCredentials(username: string, password: string) {
        const result = await this.query<AttemptLogin, AttemptLoginVariables>(ATTEMPT_LOGIN, {
            username,
            password,
        });
        if (result.login) {
            this.setAuthToken(result.login.authToken);
        } else {
            console.error(result);
        }
    }

    async asSuperAdmin() {
        await this.asUserWithCredentials(SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD);
    }

    asAnonymousUser() {
        this.setAuthToken('');
    }

    private setHeaders() {
        this.client.setHeaders({
            Authorization: `Bearer ${this.authToken}`,
            [getConfig().channelTokenKey]: this.channelToken,
        });
    }
}
