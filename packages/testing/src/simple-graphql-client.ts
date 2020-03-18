import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '@vendure/common/lib/shared-constants';
import { VendureConfig } from '@vendure/core';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import fetch, { RequestInit, Response } from 'node-fetch';
import { Curl } from 'node-libcurl';
import { stringify } from 'querystring';

import { QueryParams } from './types';
import { createUploadPostData } from './utils/create-upload-post-data';

const LOGIN = gql`
    mutation($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            user {
                id
                identifier
                channels {
                    token
                }
            }
        }
    }
`;

// tslint:disable:no-console
/**
 * @description
 * A minimalistic GraphQL client for populating and querying test data.
 *
 * @docsCategory testing
 */
export class SimpleGraphQLClient {
    private authToken: string;
    private channelToken: string | null = null;
    private headers: { [key: string]: any } = {};

    constructor(private vendureConfig: Required<VendureConfig>, private apiUrl: string = '') {}

    /**
     * @description
     * Sets the authToken to be used in each GraphQL request.
     */
    setAuthToken(token: string) {
        this.authToken = token;
        this.headers.Authorization = `Bearer ${this.authToken}`;
    }

    /**
     * @description
     * Sets the authToken to be used in each GraphQL request.
     */
    setChannelToken(token: string | null) {
        this.channelToken = token;
        this.headers[this.vendureConfig.channelTokenKey] = this.channelToken;
    }

    /**
     * @description
     * Returns the authToken currently being used.
     */
    getAuthToken(): string {
        return this.authToken;
    }

    /**
     * @description
     * Performs both query and mutation operations.
     */
    async query<T = any, V = Record<string, any>>(
        query: DocumentNode,
        variables?: V,
        queryParams?: QueryParams,
    ): Promise<T> {
        const response = await this.makeGraphQlRequest(query, variables, queryParams);
        const result = await this.getResult(response);

        if (response.ok && !result.errors && result.data) {
            return result.data;
        } else {
            const errorResult = typeof result === 'string' ? { error: result } : result;
            throw new ClientError(
                { ...errorResult, status: response.status },
                { query: print(query), variables },
            );
        }
    }

    /**
     * @description
     * Performs a raw HTTP request to the given URL, but also includes the authToken & channelToken
     * headers if they have been set. Useful for testing non-GraphQL endpoints, e.g. for plugins
     * which make use of REST controllers.
     */
    async fetch(url: string, options: RequestInit = {}): Promise<Response> {
        const headers = { 'Content-Type': 'application/json', ...this.headers, ...options.headers };

        const response = await fetch(url, {
            ...options,
            headers,
        });
        const authToken = response.headers.get(this.vendureConfig.authOptions.authTokenHeaderKey || '');
        if (authToken != null) {
            this.setAuthToken(authToken);
        }
        return response;
    }

    /**
     * @description
     * Performs a query or mutation and returns the resulting status code.
     */
    async queryStatus<T = any, V = Record<string, any>>(query: DocumentNode, variables?: V): Promise<number> {
        const response = await this.makeGraphQlRequest(query, variables);
        return response.status;
    }

    /**
     * @description
     * Attemps to log in with the specified credentials.
     */
    async asUserWithCredentials(username: string, password: string) {
        // first log out as the current user
        if (this.authToken) {
            await this.query(
                gql`
                    mutation {
                        logout
                    }
                `,
            );
        }
        const result = await this.query(LOGIN, { username, password });
        if (result.login.user.channels.length === 1) {
            this.setChannelToken(result.login.user.channels[0].token);
        }
        return result.login;
    }

    /**
     * @description
     * Logs in as the SuperAdmin user.
     */
    async asSuperAdmin() {
        await this.asUserWithCredentials(SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD);
    }

    /**
     * @description
     * Logs out so that the client is then treated as an anonymous user.
     */
    async asAnonymousUser() {
        await this.query(
            gql`
                mutation {
                    logout
                }
            `,
        );
    }

    private async makeGraphQlRequest(
        query: DocumentNode,
        variables?: { [key: string]: any },
        queryParams?: QueryParams,
    ): Promise<Response> {
        const queryString = print(query);
        const body = JSON.stringify({
            query: queryString,
            variables: variables ? variables : undefined,
        });

        const url = queryParams ? this.apiUrl + `?${stringify(queryParams)}` : this.apiUrl;

        return this.fetch(url, {
            method: 'POST',
            body,
        });
    }

    private async getResult(response: Response): Promise<any> {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.startsWith('application/json')) {
            return response.json();
        } else {
            return response.text();
        }
    }

    /**
     * @description
     * Uses curl to post a multipart/form-data request to the server. Due to differences between the Node and browser
     * environments, we cannot just use an existing library like apollo-upload-client.
     *
     * Upload spec: https://github.com/jaydenseric/graphql-multipart-request-spec
     * Discussion of issue: https://github.com/jaydenseric/apollo-upload-client/issues/32
     */
    fileUploadMutation(options: {
        mutation: DocumentNode;
        filePaths: string[];
        mapVariables: (filePaths: string[]) => any;
    }): Promise<any> {
        const { mutation, filePaths, mapVariables } = options;
        return new Promise((resolve, reject) => {
            const curl = new Curl();

            const postData = createUploadPostData(mutation, filePaths, mapVariables);
            const processedPostData = [
                {
                    name: 'operations',
                    contents: JSON.stringify(postData.operations),
                },
                {
                    name: 'map',
                    contents:
                        '{' +
                        Object.entries(postData.map)
                            .map(([i, path]) => `"${i}":["${path}"]`)
                            .join(',') +
                        '}',
                },
                ...postData.filePaths,
            ];
            curl.setOpt(Curl.option.URL, this.apiUrl);
            curl.setOpt(Curl.option.VERBOSE, false);
            curl.setOpt(Curl.option.TIMEOUT_MS, 30000);
            curl.setOpt(Curl.option.HTTPPOST, processedPostData);
            curl.setOpt(Curl.option.HTTPHEADER, [
                `Authorization: Bearer ${this.authToken}`,
                `${this.vendureConfig.channelTokenKey}: ${this.channelToken}`,
            ]);
            curl.perform();
            curl.on('end', (statusCode: any, body: any) => {
                curl.close();
                const response = JSON.parse(body);
                if (response.errors && response.errors.length) {
                    const error = response.errors[0];
                    console.log(JSON.stringify(error.extensions, null, 2));
                    throw new Error(error.message);
                }
                resolve(response.data);
            });

            curl.on('error', (err: any) => {
                curl.close();
                console.log(err);
                reject(err);
            });
        });
    }
}

export class ClientError extends Error {
    constructor(public response: any, public request: any) {
        super(ClientError.extractMessage(response));
    }
    private static extractMessage(response: any): string {
        if (response.errors) {
            return response.errors[0].message;
        } else {
            return `GraphQL Error (Code: ${response.status})`;
        }
    }
}
