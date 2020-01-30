/* tslint:disable:no-non-null-assertion */
import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '@vendure/common/lib/shared-constants';
import { createTestEnvironment } from '@vendure/testing';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    CreateAdministrator,
    CreateRole,
    Me,
    MutationCreateProductArgs,
    MutationLoginArgs,
    MutationUpdateProductArgs,
    Permission,
} from './graphql/generated-e2e-admin-types';
import {
    ATTEMPT_LOGIN,
    CREATE_ADMINISTRATOR,
    CREATE_PRODUCT,
    CREATE_ROLE,
    GET_PRODUCT_LIST,
    ME,
    UPDATE_PRODUCT,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Authorization & permissions', () => {
    const { server, adminClient } = createTestEnvironment(testConfig);

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

    describe('admin permissions', () => {
        describe('Anonymous user', () => {
            beforeAll(async () => {
                await adminClient.asAnonymousUser();
            });

            it(
                'me is not permitted',
                assertThrowsWithMessage(async () => {
                    await adminClient.query<Me.Query>(ME);
                }, 'You are not currently authorized to perform this action'),
            );

            it('can attempt login', async () => {
                await assertRequestAllowed<MutationLoginArgs>(ATTEMPT_LOGIN, {
                    username: SUPER_ADMIN_USER_IDENTIFIER,
                    password: SUPER_ADMIN_USER_PASSWORD,
                    rememberMe: false,
                });
            });
        });

        describe('ReadCatalog permission', () => {
            beforeAll(async () => {
                await adminClient.asSuperAdmin();
                const { identifier, password } = await createAdministratorWithPermissions('ReadCatalog', [
                    Permission.ReadCatalog,
                ]);
                await adminClient.asUserWithCredentials(identifier, password);
            });

            it('me returns correct permissions', async () => {
                const { me } = await adminClient.query<Me.Query>(ME);

                expect(me!.channels[0].permissions).toEqual([
                    Permission.Authenticated,
                    Permission.ReadCatalog,
                ]);
            });

            it('can read', async () => {
                await assertRequestAllowed(GET_PRODUCT_LIST);
            });

            it('cannot uppdate', async () => {
                await assertRequestForbidden<MutationUpdateProductArgs>(UPDATE_PRODUCT, {
                    input: {
                        id: '1',
                        translations: [],
                    },
                });
            });

            it('cannot create', async () => {
                await assertRequestForbidden<MutationCreateProductArgs>(CREATE_PRODUCT, {
                    input: {
                        translations: [],
                    },
                });
            });
        });

        describe('CRUD on Customers permissions', () => {
            beforeAll(async () => {
                await adminClient.asSuperAdmin();
                const { identifier, password } = await createAdministratorWithPermissions('CRUDCustomer', [
                    Permission.CreateCustomer,
                    Permission.ReadCustomer,
                    Permission.UpdateCustomer,
                    Permission.DeleteCustomer,
                ]);
                await adminClient.asUserWithCredentials(identifier, password);
            });

            it('me returns correct permissions', async () => {
                const { me } = await adminClient.query<Me.Query>(ME);

                expect(me!.channels[0].permissions).toEqual([
                    Permission.Authenticated,
                    Permission.CreateCustomer,
                    Permission.ReadCustomer,
                    Permission.UpdateCustomer,
                    Permission.DeleteCustomer,
                ]);
            });

            it('can create', async () => {
                await assertRequestAllowed(
                    gql`
                        mutation CanCreateCustomer($input: CreateCustomerInput!) {
                            createCustomer(input: $input) {
                                id
                            }
                        }
                    `,
                    { input: { emailAddress: '', firstName: '', lastName: '' } },
                );
            });

            it('can read', async () => {
                await assertRequestAllowed(gql`
                    query GetCustomerCount {
                        customers {
                            totalItems
                        }
                    }
                `);
            });
        });
    });

    async function assertRequestAllowed<V>(operation: DocumentNode, variables?: V) {
        try {
            const status = await adminClient.queryStatus(operation, variables);
            expect(status).toBe(200);
        } catch (e) {
            const errorCode = getErrorCode(e);
            if (!errorCode) {
                fail(`Unexpected failure: ${e}`);
            } else {
                fail(`Operation should be allowed, got status ${getErrorCode(e)}`);
            }
        }
    }

    async function assertRequestForbidden<V>(operation: DocumentNode, variables: V) {
        try {
            const status = await adminClient.query(operation, variables);
            fail(`Should have thrown`);
        } catch (e) {
            expect(getErrorCode(e)).toBe('FORBIDDEN');
        }
    }

    function getErrorCode(err: any): string {
        return err.response.errors[0].extensions.code;
    }

    async function createAdministratorWithPermissions(
        code: string,
        permissions: Permission[],
    ): Promise<{ identifier: string; password: string }> {
        const roleResult = await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, {
            input: {
                code,
                description: '',
                permissions,
            },
        });

        const role = roleResult.createRole;

        const identifier = `${code}@${Math.random()
            .toString(16)
            .substr(2, 8)}`;
        const password = `test`;

        const adminResult = await adminClient.query<
            CreateAdministrator.Mutation,
            CreateAdministrator.Variables
        >(CREATE_ADMINISTRATOR, {
            input: {
                emailAddress: identifier,
                firstName: code,
                lastName: 'Admin',
                password,
                roleIds: [role.id],
            },
        });
        const admin = adminResult.createAdministrator;

        return {
            identifier,
            password,
        };
    }
});
