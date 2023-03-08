import { mergeConfig } from '@vendure/core';
import {
    ApolloServerPlugin,
    GraphQLRequestContext,
    GraphQLRequestListener,
    GraphQLServiceContext,
} from 'apollo-server-plugin-base';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { createTestEnvironment } from '../../testing/lib/create-test-environment';

class MyApolloServerPlugin implements ApolloServerPlugin {
    static serverWillStartFn = vi.fn();
    static requestDidStartFn = vi.fn();
    static willSendResponseFn = vi.fn();

    static reset() {
        this.serverWillStartFn = vi.fn();
        this.requestDidStartFn = vi.fn();
        this.willSendResponseFn = vi.fn();
    }

    serverWillStart(service: GraphQLServiceContext): Promise<void> | void {
        MyApolloServerPlugin.serverWillStartFn(service);
    }

    requestDidStart(): GraphQLRequestListener | void {
        MyApolloServerPlugin.requestDidStartFn();
        return {
            willSendResponse(requestContext: any): Promise<void> | void {
                const data = requestContext.response.data;
                MyApolloServerPlugin.willSendResponseFn(data);
            },
        };
    }
}

describe('custom apolloServerPlugins', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            apiOptions: {
                apolloServerPlugins: [new MyApolloServerPlugin()],
            },
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('calls serverWillStart()', () => {
        expect(MyApolloServerPlugin.serverWillStartFn).toHaveBeenCalled();
    });

    it('runs plugin on shop api query', async () => {
        MyApolloServerPlugin.reset();
        await shopClient.query(gql`
            query Q1 {
                product(id: "T_1") {
                    id
                    name
                }
            }
        `);

        expect(MyApolloServerPlugin.requestDidStartFn).toHaveBeenCalledTimes(1);
        expect(MyApolloServerPlugin.willSendResponseFn).toHaveBeenCalledTimes(1);
        expect(MyApolloServerPlugin.willSendResponseFn.mock.calls[0][0]).toEqual({
            product: {
                id: 'T_1',
                name: 'Laptop',
            },
        });
    });

    it('runs plugin on admin api query', async () => {
        MyApolloServerPlugin.reset();
        await adminClient.query(gql`
            query Q2 {
                product(id: "T_1") {
                    id
                    name
                }
            }
        `);

        expect(MyApolloServerPlugin.requestDidStartFn).toHaveBeenCalledTimes(1);
        expect(MyApolloServerPlugin.willSendResponseFn).toHaveBeenCalledTimes(1);
        expect(MyApolloServerPlugin.willSendResponseFn.mock.calls[0][0]).toEqual({
            product: {
                id: 'T_1',
                name: 'Laptop',
            },
        });
    });
});
