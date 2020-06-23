import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { TestAuthenticationStrategy, VALID_AUTH_TOKEN } from './fixtures/test-authentication-strategies';
import { Authenticate, GetCustomers, Me } from './graphql/generated-e2e-admin-types';
import { ME } from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('AuthenticationStrategy', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            authOptions: {
                shopAuthenticationStrategy: [new TestAuthenticationStrategy()],
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

    describe('external auth', () => {
        const userData = {
            email: 'test@email.com',
            firstName: 'Cixin',
            lastName: 'Liu',
        };

        it(
            'fails with a bad token',
            assertThrowsWithMessage(async () => {
                await shopClient.query(AUTHENTICATE, {
                    input: {
                        test_strategy: {
                            token: 'bad-token',
                        },
                    },
                });
            }, 'The credentials did not match. Please check and try again'),
        );

        it('creates a new Customer with valid token', async () => {
            const { customers: before } = await adminClient.query<GetCustomers.Query>(GET_CUSTOMERS);
            expect(before.totalItems).toBe(1);

            const result = await shopClient.query<Authenticate.Mutation>(AUTHENTICATE, {
                input: {
                    test_strategy: {
                        token: VALID_AUTH_TOKEN,
                        userData,
                    },
                },
            });
            expect(result.authenticate.user.identifier).toEqual(userData.email);

            const { customers: after } = await adminClient.query<GetCustomers.Query>(GET_CUSTOMERS);
            expect(after.totalItems).toBe(2);
            expect(after.items.map(i => i.emailAddress)).toEqual([
                'hayden.zieme12@hotmail.com',
                userData.email,
            ]);
        });

        it('creates authenticated session', async () => {
            const { me } = await shopClient.query<Me.Query>(ME);

            expect(me?.identifier).toBe(userData.email);
        });

        it('log out', async () => {
            await shopClient.asAnonymousUser();
        });

        it('logging in again re-uses created User & Customer', async () => {
            const result = await shopClient.query<Authenticate.Mutation>(AUTHENTICATE, {
                input: {
                    test_strategy: {
                        token: VALID_AUTH_TOKEN,
                        userData,
                    },
                },
            });
            expect(result.authenticate.user.identifier).toEqual(userData.email);

            const { customers: after } = await adminClient.query<GetCustomers.Query>(GET_CUSTOMERS);
            expect(after.totalItems).toBe(2);
            expect(after.items.map(i => i.emailAddress)).toEqual([
                'hayden.zieme12@hotmail.com',
                userData.email,
            ]);
        });
    });
});

const AUTHENTICATE = gql`
    mutation Authenticate($input: AuthenticationInput!) {
        authenticate(input: $input) {
            user {
                id
                identifier
            }
        }
    }
`;

const GET_CUSTOMERS = gql`
    query GetCustomers {
        customers {
            totalItems
            items {
                id
                emailAddress
            }
        }
    }
`;
