import { DocumentNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { Curl } from 'node-libcurl';

import { CREATE_ASSETS } from '../../admin-ui/src/app/data/definitions/product-definitions';
import { CreateAssets, ImportInfo } from '../../shared/generated-types';
import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '../../shared/shared-constants';
import { getConfig } from '../src/config/vendure-config';

import { createUploadPostData } from './create-upload-post-data';

// tslint:disable:no-console
/**
 * A minimalistic GraphQL client for populating and querying test data.
 */
export class SimpleGraphQLClient {
    private client: GraphQLClient;
    private authToken: string;
    private channelToken: string;

    constructor(private apiUrl: string = '') {
        this.client = new GraphQLClient(apiUrl);
    }

    setAuthToken(token: string) {
        this.authToken = token;
        this.setHeaders();
    }

    getAuthToken(): string {
        return this.authToken;
    }

    setChannelToken(token: string) {
        this.channelToken = token;
        this.setHeaders();
    }

    /**
     * Performs both query and mutation operations.
     */
    async query<T = any, V = Record<string, any>>(query: DocumentNode, variables?: V): Promise<T> {
        const queryString = print(query);
        const result = await this.client.rawRequest<T>(queryString, variables);

        const authToken = result.headers.get(getConfig().authOptions.authTokenHeaderKey);
        if (authToken != null) {
            this.setAuthToken(authToken);
        }
        return result.data as T;
    }

    async queryStatus<T = any, V = Record<string, any>>(query: DocumentNode, variables?: V): Promise<number> {
        const queryString = print(query);
        const result = await this.client.rawRequest<T>(queryString, variables);
        return result.status;
    }

    uploadAssets(filePaths: string[]): Promise<CreateAssets.Mutation> {
        return this.fileUploadMutation({
            mutation: CREATE_ASSETS,
            filePaths,
            mapVariables: fp => ({
                input: fp.map(() => ({ file: null })),
            }),
        });
    }

    importProducts(csvFilePath: string): Promise<{ importProducts: ImportInfo }> {
        return this.fileUploadMutation({
            mutation: gql`
                mutation ImportProducts($csvFile: Upload!) {
                    importProducts(csvFile: $csvFile) {
                        importedCount
                        errors
                    }
                }
            `,
            filePaths: [csvFilePath],
            mapVariables: () => ({ csvFile: null }),
        });
    }

    /**
     * Uses curl to post a multipart/form-data request to the server. Due to differences between the Node and browser
     * environments, we cannot just use an existing library like apollo-upload-client.
     *
     * Upload spec: https://github.com/jaydenseric/graphql-multipart-request-spec
     * Discussion of issue: https://github.com/jaydenseric/apollo-upload-client/issues/32
     */
    private fileUploadMutation(options: {
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
                `${getConfig().channelTokenKey}: ${this.channelToken}`,
            ]);
            curl.perform();
            curl.on('end', (statusCode, body) => {
                curl.close();
                resolve(JSON.parse(body).data);
            });

            curl.on('error', err => {
                curl.close();
                console.log(err);
                reject(err);
            });
        });
    }

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
        const result = await this.query(
            gql`
                mutation($username: String!, $password: String!) {
                    login(username: $username, password: $password) {
                        user {
                            id
                            identifier
                            channelTokens
                        }
                    }
                }
            `,
            {
                username,
                password,
            },
        );
    }

    async asSuperAdmin() {
        await this.asUserWithCredentials(SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD);
    }

    async asAnonymousUser() {
        await this.query(
            gql`
                mutation {
                    logout
                }
            `,
        );
    }

    private setHeaders() {
        const headers: any = {
            [getConfig().channelTokenKey]: this.channelToken,
        };
        if (this.authToken) {
            headers.Authorization = `Bearer ${this.authToken}`;
        }
        this.client.setHeaders(headers);
    }
}
