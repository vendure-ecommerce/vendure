/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ErrorCode } from '@vendure/common/lib/generated-shop-types';
import { pick } from '@vendure/common/lib/pick';
import { mergeConfig, NativeAuthenticationStrategy } from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    TestAuthenticationStrategy,
    TestAuthenticationStrategy2,
    TestSSOStrategyAdmin,
    TestSSOStrategyShop,
    VALID_AUTH_TOKEN,
} from './fixtures/test-authentication-strategies';
import { CURRENT_USER_FRAGMENT } from './graphql/fragments';
import {
    AttemptLoginDocument,
    CurrentUserFragment,
    CustomerFragment,
    HistoryEntryType,
} from './graphql/generated-e2e-admin-types';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { RegisterMutation, RegisterMutationVariables } from './graphql/generated-e2e-shop-types';
import { CREATE_CUSTOMER, DELETE_CUSTOMER, GET_CUSTOMER_HISTORY, ME } from './graphql/shared-definitions';
import { REGISTER_ACCOUNT } from './graphql/shop-definitions';

const currentUserGuard: ErrorResultGuard<CurrentUserFragment> = createErrorResultGuard(
    input => input.identifier != null,
);
const customerGuard: ErrorResultGuard<CustomerFragment> = createErrorResultGuard(
    input => input.emailAddress != null,
);

describe('AuthenticationStrategy', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            authOptions: {
                shopAuthenticationStrategy: [
                    new NativeAuthenticationStrategy(),
                    new TestAuthenticationStrategy(),
                    new TestAuthenticationStrategy2(),
                    new TestSSOStrategyShop(),
                ],
                adminAuthenticationStrategy: [new NativeAuthenticationStrategy(), new TestSSOStrategyAdmin()],
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

        it('fails with a bad token', async () => {
            const { authenticate } = await shopClient.query(AUTHENTICATE, {
                input: {
                    test_strategy: {
                        token: 'bad-token',
                    },
                },
            });

            expect(authenticate.message).toBe('The provided credentials are invalid');
            expect(authenticate.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
            expect(authenticate.authenticationError).toBe('');
        });

        it('fails with an expired token', async () => {
            const { authenticate } = await shopClient.query(AUTHENTICATE, {
                input: {
                    test_strategy: {
                        token: 'expired-token',
                    },
                },
            });

            expect(authenticate.message).toBe('The provided credentials are invalid');
            expect(authenticate.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
            expect(authenticate.authenticationError).toBe('Expired token');
        });

        it('creates a new Customer with valid token', async () => {
            const { customers: before } = await adminClient.query<Codegen.GetCustomersQuery>(GET_CUSTOMERS);
            expect(before.totalItems).toBe(1);

            const { authenticate } = await shopClient.query<Codegen.AuthenticateMutation>(AUTHENTICATE, {
                input: {
                    test_strategy: {
                        token: VALID_AUTH_TOKEN,
                        userData,
                    },
                },
            });
            currentUserGuard.assertSuccess(authenticate);

            expect(authenticate.identifier).toEqual(userData.email);

            const { customers: after } = await adminClient.query<Codegen.GetCustomersQuery>(GET_CUSTOMERS);
            expect(after.totalItems).toBe(2);
            expect(after.items.map(i => i.emailAddress)).toEqual([
                'hayden.zieme12@hotmail.com',
                userData.email,
            ]);
            newCustomerId = after.items[1].id;
        });

        it('creates customer history entry', async () => {
            const { customer } = await adminClient.query<
                Codegen.GetCustomerHistoryQuery,
                Codegen.GetCustomerHistoryQueryVariables
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
                Codegen.GetCustomerUserAuthQuery,
                Codegen.GetCustomerUserAuthQueryVariables
            >(GET_CUSTOMER_USER_AUTH, {
                id: newCustomerId,
            });

            expect(customer?.user?.authenticationMethods.length).toBe(1);
            expect(customer?.user?.authenticationMethods[0].strategy).toBe('test_strategy');
        });

        it('creates authenticated session', async () => {
            const { me } = await shopClient.query<Codegen.MeQuery>(ME);

            expect(me?.identifier).toBe(userData.email);
        });

        it('log out', async () => {
            await shopClient.asAnonymousUser();
        });

        it('logging in again re-uses created User & Customer', async () => {
            const { authenticate } = await shopClient.query<Codegen.AuthenticateMutation>(AUTHENTICATE, {
                input: {
                    test_strategy: {
                        token: VALID_AUTH_TOKEN,
                        userData,
                    },
                },
            });
            currentUserGuard.assertSuccess(authenticate);
            expect(authenticate.identifier).toEqual(userData.email);

            const { customers: after } = await adminClient.query<Codegen.GetCustomersQuery>(GET_CUSTOMERS);
            expect(after.totalItems).toBe(2);
            expect(after.items.map(i => i.emailAddress)).toEqual([
                'hayden.zieme12@hotmail.com',
                userData.email,
            ]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/695
        it('multiple external auth strategies to not interfere with one another', async () => {
            const EXPECTED_CUSTOMERS = [
                {
                    emailAddress: 'hayden.zieme12@hotmail.com',
                    id: 'T_1',
                },
                {
                    emailAddress: 'test@email.com',
                    id: 'T_2',
                },
            ];

            const { customers: customers1 } = await adminClient.query<Codegen.GetCustomersQuery>(
                GET_CUSTOMERS,
            );
            expect(customers1.items).toEqual(EXPECTED_CUSTOMERS);
            const { authenticate: auth1 } = await shopClient.query<Codegen.AuthenticateMutation>(
                AUTHENTICATE,
                {
                    input: {
                        test_strategy2: {
                            token: VALID_AUTH_TOKEN,
                            email: userData.email,
                        },
                    },
                },
            );

            currentUserGuard.assertSuccess(auth1);
            expect(auth1.identifier).toBe(userData.email);

            const { customers: customers2 } = await adminClient.query<Codegen.GetCustomersQuery>(
                GET_CUSTOMERS,
            );
            expect(customers2.items).toEqual(EXPECTED_CUSTOMERS);

            await shopClient.asAnonymousUser();

            const { authenticate: auth2 } = await shopClient.query<Codegen.AuthenticateMutation>(
                AUTHENTICATE,
                {
                    input: {
                        test_strategy: {
                            token: VALID_AUTH_TOKEN,
                            userData,
                        },
                    },
                },
            );

            currentUserGuard.assertSuccess(auth2);
            expect(auth2.identifier).toBe(userData.email);

            const { customers: customers3 } = await adminClient.query<Codegen.GetCustomersQuery>(
                GET_CUSTOMERS,
            );
            expect(customers3.items).toEqual(EXPECTED_CUSTOMERS);
        });

        it('registerCustomerAccount with external email', async () => {
            const successErrorGuard: ErrorResultGuard<{ success: boolean }> = createErrorResultGuard(
                input => input.success != null,
            );

            const { registerCustomerAccount } = await shopClient.query<
                RegisterMutation,
                RegisterMutationVariables
            >(REGISTER_ACCOUNT, {
                input: {
                    emailAddress: userData.email,
                },
            });
            successErrorGuard.assertSuccess(registerCustomerAccount);

            expect(registerCustomerAccount.success).toBe(true);
            const { customer } = await adminClient.query<
                Codegen.GetCustomerUserAuthQuery,
                Codegen.GetCustomerUserAuthQueryVariables
            >(GET_CUSTOMER_USER_AUTH, {
                id: newCustomerId,
            });

            expect(customer?.user?.authenticationMethods.length).toBe(3);
            expect(customer?.user?.authenticationMethods.map(m => m.strategy)).toEqual([
                'test_strategy',
                'test_strategy2',
                'native',
            ]);

            const { customer: customer2 } = await adminClient.query<
                Codegen.GetCustomerHistoryQuery,
                Codegen.GetCustomerHistoryQueryVariables
            >(GET_CUSTOMER_HISTORY, {
                id: newCustomerId,
                options: {
                    skip: 4,
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

        // https://github.com/vendure-ecommerce/vendure/issues/926
        it('Customer and Admin external auth does not reuse same User for different strategies', async () => {
            const emailAddress = 'hello@test-domain.com';
            await adminClient.asAnonymousUser();
            const { authenticate: adminAuth } = await adminClient.query<Codegen.AuthenticateMutation>(
                AUTHENTICATE,
                {
                    input: {
                        test_sso_strategy_admin: {
                            email: emailAddress,
                        },
                    },
                },
            );
            currentUserGuard.assertSuccess(adminAuth);

            const { authenticate: shopAuth } = await shopClient.query<Codegen.AuthenticateMutation>(
                AUTHENTICATE,
                {
                    input: {
                        test_sso_strategy_shop: {
                            email: emailAddress,
                        },
                    },
                },
            );
            currentUserGuard.assertSuccess(shopAuth);

            expect(adminAuth.id).not.toBe(shopAuth.id);
        });
    });

    describe('native auth', () => {
        const testEmailAddress = 'test-person@testdomain.com';

        // https://github.com/vendure-ecommerce/vendure/issues/486#issuecomment-704991768
        it('allows login for an email address which is shared by a previously-deleted Customer', async () => {
            const { createCustomer: result1 } = await adminClient.query<
                Codegen.CreateCustomerMutation,
                Codegen.CreateCustomerMutationVariables
            >(CREATE_CUSTOMER, {
                input: {
                    firstName: 'Test',
                    lastName: 'Person',
                    emailAddress: testEmailAddress,
                },
                password: 'password1',
            });
            customerGuard.assertSuccess(result1);

            await adminClient.query<Codegen.DeleteCustomerMutation, Codegen.DeleteCustomerMutationVariables>(
                DELETE_CUSTOMER,
                {
                    id: result1.id,
                },
            );

            const { createCustomer: result2 } = await adminClient.query<
                Codegen.CreateCustomerMutation,
                Codegen.CreateCustomerMutationVariables
            >(CREATE_CUSTOMER, {
                input: {
                    firstName: 'Test',
                    lastName: 'Person',
                    emailAddress: testEmailAddress,
                },
                password: 'password2',
            });
            customerGuard.assertSuccess(result2);

            const { authenticate } = await shopClient.query(AUTHENTICATE, {
                input: {
                    native: {
                        username: testEmailAddress,
                        password: 'password2',
                    },
                },
            });
            currentUserGuard.assertSuccess(authenticate);

            expect(pick(authenticate, ['id', 'identifier'])).toEqual({
                id: result2.user!.id,
                identifier: result2.emailAddress,
            });
        });
    });
});

describe('No NativeAuthStrategy on Shop API', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
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

    // https://github.com/vendure-ecommerce/vendure/issues/2282
    it('can log in to Admin API', async () => {
        const { login } = await adminClient.query(AttemptLoginDocument, {
            username: 'superadmin',
            password: 'superadmin',
        });

        currentUserGuard.assertSuccess(login);
        expect(login.identifier).toBe('superadmin');
    });
});

const AUTHENTICATE = gql`
    mutation Authenticate($input: AuthenticationInput!) {
        authenticate(input: $input) {
            ...CurrentUser
            ... on InvalidCredentialsError {
                authenticationError
                errorCode
                message
            }
        }
    }
    ${CURRENT_USER_FRAGMENT}
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
