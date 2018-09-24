import { DocumentNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql/language/printer';
import { Curl } from 'node-libcurl';
import { AttemptLogin, AttemptLoginVariables, CreateAssets } from 'shared/generated-types';
import {
    AUTH_TOKEN_KEY,
    SUPER_ADMIN_USER_IDENTIFIER,
    SUPER_ADMIN_USER_PASSWORD,
} from 'shared/shared-constants';

import { ATTEMPT_LOGIN } from '../../admin-ui/src/app/data/definitions/auth-definitions';
import { CREATE_ASSETS } from '../../admin-ui/src/app/data/definitions/product-definitions';
import { getConfig } from '../src/config/vendure-config';

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

    setChannelToken(token: string) {
        this.channelToken = token;
        this.setHeaders();
    }

    /**
     * Performs both query and mutation operations.
     */
    query<T = any, V = Record<string, any>>(query: DocumentNode, variables?: V): Promise<T> {
        const queryString = print(query);
        return this.client.request(queryString, variables);
    }

    async queryStatus<T = any, V = Record<string, any>>(query: DocumentNode, variables?: V): Promise<number> {
        const queryString = print(query);
        const result = await this.client.rawRequest<T>(queryString, variables);
        return result.status;
    }

    /**
     * Uses curl to post a multipart/form-data request to create new assets. Due to differences between the Node and browser
     * environments, we cannot just use an existing library like apollo-upload-client.
     *
     * Upload spec: https://github.com/jaydenseric/graphql-multipart-request-spec
     * Discussion of issue: https://github.com/jaydenseric/apollo-upload-client/issues/32
     */
    uploadAssets(filePaths: string[]): Promise<CreateAssets> {
        return new Promise((resolve, reject) => {
            const curl = new Curl();

            const postData: any[] = [
                {
                    name: 'operations',
                    contents: JSON.stringify({
                        operationName: 'CreateAssets',
                        variables: {
                            input: filePaths.map(() => ({ file: null })),
                        },
                        query: print(CREATE_ASSETS),
                    }),
                },
                {
                    name: 'map',
                    contents:
                        '{' +
                        filePaths.map((filePath, i) => `"${i}":["variables.input.${i}.file"]`).join(',') +
                        '}',
                },
                ...filePaths.map((filePath, i) => ({
                    name: i.toString(),
                    file: filePath,
                })),
            ];
            curl.setOpt(Curl.option.URL, this.apiUrl);
            curl.setOpt(Curl.option.VERBOSE, false);
            curl.setOpt(Curl.option.TIMEOUT_MS, 30000);
            curl.setOpt(Curl.option.HTTPPOST, postData);
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
        const result = await this.client.rawRequest<AttemptLogin>(print(ATTEMPT_LOGIN), {
            username,
            password,
        } as AttemptLoginVariables);
        if (result.data && result.data.login) {
            this.setAuthToken(result.headers.get(AUTH_TOKEN_KEY));
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
