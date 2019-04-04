import {
    CreateAdministrator,
    CreateProductMutationArgs,
    CreateRole,
    LoginMutationArgs,
    Permission,
    UpdateProductMutationArgs,
} from '@vendure/common/lib/generated-types';
import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '@vendure/common/lib/shared-constants';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_ADMINISTRATOR,
    CREATE_ROLE,
} from '../../../admin-ui/src/app/data/definitions/administrator-definitions';
import { ATTEMPT_LOGIN } from '../../../admin-ui/src/app/data/definitions/auth-definitions';
import {
    CREATE_PRODUCT,
    GET_PRODUCT_LIST,
    UPDATE_PRODUCT,
} from '../../../admin-ui/src/app/data/definitions/product-definitions';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';

describe('Authorization & permissions', () => {
    const client = new TestAdminClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('admin permissions', () => {
        describe('Anonymous user', () => {
            beforeAll(async () => {
                await client.asAnonymousUser();
            });

            it('can attempt login', async () => {
                await assertRequestAllowed<LoginMutationArgs>(ATTEMPT_LOGIN, {
                    username: SUPER_ADMIN_USER_IDENTIFIER,
                    password: SUPER_ADMIN_USER_PASSWORD,
                    rememberMe: false,
                });
            });
        });

        describe('ReadCatalog', () => {
            beforeAll(async () => {
                await client.asSuperAdmin();
                const { identifier, password } = await createAdministratorWithPermissions('ReadCatalog', [
                    Permission.ReadCatalog,
                ]);
                await client.asUserWithCredentials(identifier, password);
            });

            it('can read', async () => {
                await assertRequestAllowed(GET_PRODUCT_LIST);
            });

            it('cannot uppdate', async () => {
                await assertRequestForbidden<UpdateProductMutationArgs>(UPDATE_PRODUCT, {
                    input: {
                        id: '1',
                        translations: [],
                    },
                });
            });

            it('cannot create', async () => {
                await assertRequestForbidden<CreateProductMutationArgs>(CREATE_PRODUCT, {
                    input: {
                        translations: [],
                    },
                });
            });
        });

        describe('CRUD on Customers', () => {
            beforeAll(async () => {
                await client.asSuperAdmin();
                const { identifier, password } = await createAdministratorWithPermissions('CRUDCustomer', [
                    Permission.CreateCustomer,
                    Permission.ReadCustomer,
                    Permission.UpdateCustomer,
                    Permission.DeleteCustomer,
                ]);
                await client.asUserWithCredentials(identifier, password);
            });

            it('can create', async () => {
                await assertRequestAllowed(
                    gql`
                        mutation CreateCustomer($input: CreateCustomerInput!) {
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
                    query {
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
            const status = await client.queryStatus(operation, variables);
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
            const status = await client.query(operation, variables);
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
        const roleResult = await client.query<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, {
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

        const adminResult = await client.query<CreateAdministrator.Mutation, CreateAdministrator.Variables>(
            CREATE_ADMINISTRATOR,
            {
                input: {
                    emailAddress: identifier,
                    firstName: code,
                    lastName: 'Admin',
                    password,
                    roleIds: [role.id],
                },
            },
        );
        const admin = adminResult.createAdministrator;

        return {
            identifier,
            password,
        };
    }
});
