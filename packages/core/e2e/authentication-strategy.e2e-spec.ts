import { pick } from '@vendure/common/lib/pick';
import { mergeConfig } from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { NativeAuthenticationStrategy } from '../src/config/auth/native-authentication-strategy';
import { DefaultLogger } from '../src/config/logger/default-logger';

import { TestAuthenticationStrategy, VALID_AUTH_TOKEN } from './fixtures/test-authentication-strategies';
import {
    Authenticate,
    GetCustomerHistory,
    GetCustomers,
    GetCustomerUserAuth,
    HistoryEntryType,
    Me,
} from './graphql/generated-e2e-admin-types';
import { Register } from './graphql/generated-e2e-shop-types';
import { GET_CUSTOMER_HISTORY, ME } from './graphql/shared-definitions';
import { REGISTER_ACCOUNT } from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('AuthenticationStrategy', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            authOptions: {
                shopAuthenticationStrategy: [
                    new NativeAuthenticationStrategy(),
                    new TestAuthenticationStrategy(),
                ],
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
        let newCustomerId: string;

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
            newCustomerId = after.items[1].id;
        });

        it('creates customer history entry', async () => {
            const { customer } = await adminClient.query<
                GetCustomerHistory.Query,
                GetCustomerHistory.Variables
            >(GET_CUSTOMER_HISTORY, {
                id: newCustomerId,
            });

            expect(
                customer?.history.items.sort((a, b) => (a.id > b.id ? 1 : -1)).map(pick(['type', 'data'])),
            ).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_REGISTERED,
                    data: {
                        strategy: 'test_strategy',
                    },
                },
                {
                    type: HistoryEntryType.CUSTOMER_VERIFIED,
                    data: {
                        strategy: 'test_strategy',
                    },
                },
            ]);
        });

        it('user authenticationMethod populated', async () => {
            const { customer } = await adminClient.query<
                GetCustomerUserAuth.Query,
                GetCustomerUserAuth.Variables
            >(GET_CUSTOMER_USER_AUTH, {
                id: newCustomerId,
            });

            expect(customer?.user?.authenticationMethods.length).toBe(1);
            expect(customer?.user?.authenticationMethods[0].strategy).toBe('test_strategy');
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

        it('registerCustomerAccount with external email', async () => {
            const successErrorGuard: ErrorResultGuard<{ success: boolean }> = createErrorResultGuard<{
                success: boolean;
            }>(input => input.success != null);

            const { registerCustomerAccount } = await shopClient.query<Register.Mutation, Register.Variables>(
                REGISTER_ACCOUNT,
                {
                    input: {
                        emailAddress: userData.email,
                    },
                },
            );
            successErrorGuard.assertSuccess(registerCustomerAccount);

            expect(registerCustomerAccount.success).toBe(true);
            const { customer } = await adminClient.query<
                GetCustomerUserAuth.Query,
                GetCustomerUserAuth.Variables
            >(GET_CUSTOMER_USER_AUTH, {
                id: newCustomerId,
            });

            expect(customer?.user?.authenticationMethods.length).toBe(2);
            expect(customer?.user?.authenticationMethods[1].strategy).toBe('native');

            const { customer: customer2 } = await adminClient.query<
                GetCustomerHistory.Query,
                GetCustomerHistory.Variables
            >(GET_CUSTOMER_HISTORY, {
                id: newCustomerId,
                options: {
                    skip: 2,
                },
            });

            expect(customer2?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_REGISTERED,
                    data: {
                        strategy: 'native',
                    },
                },
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

const GET_CUSTOMER_USER_AUTH = gql`
    query GetCustomerUserAuth($id: ID!) {
        customer(id: $id) {
            id
            user {
                id
                verified
                authenticationMethods {
                    id
                    strategy
                }
            }
        }
    }
`;
