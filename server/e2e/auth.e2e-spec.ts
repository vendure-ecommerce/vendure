import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import {
    CreateAdministrator,
    CreateProductMutationArgs,
    CreateRole,
    LoginMutationArgs,
    Permission,
    UpdateProductMutationArgs,
} from 'shared/generated-types';
import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from 'shared/shared-constants';

import {
    CREATE_ADMINISTRATOR,
    CREATE_ROLE,
} from '../../admin-ui/src/app/data/definitions/administrator-definitions';
import { ATTEMPT_LOGIN } from '../../admin-ui/src/app/data/definitions/auth-definitions';
import {
    CREATE_PRODUCT,
    GET_PRODUCT_LIST,
    UPDATE_PRODUCT,
} from '../../admin-ui/src/app/data/definitions/product-definitions';

import { TestClient } from './test-client';
import { TestServer } from './test-server';

describe('Authorization & permissions', () => {
    const client = new TestClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init({
            productCount: 1,
            customerCount: 1,
        });
        await client.init();
    }, 60000);

    afterAll(async () => {
        await server.destroy();
    });

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

    async function assertRequestAllowed<V>(operation: DocumentNode, variables?: V) {
        try {
            const status = await client.queryStatus(operation, variables);
            expect(status).toBe(200);
        } catch (e) {
            const status = getErrorStatusCode(e);
            if (!status) {
                fail(`Unexpected failure: ${e}`);
            } else {
                fail(`Operation should be allowed, got status ${getErrorStatusCode(e)}`);
            }
        }
    }

    async function assertRequestForbidden<V>(operation: DocumentNode, variables: V) {
        try {
            const status = await client.queryStatus(operation, variables);
            fail(`Should have thrown with 403 error, got ${status}`);
        } catch (e) {
            expect(getErrorStatusCode(e)).toBe(403);
        }
    }

    function getErrorStatusCode(err: any): number {
        return err.response.errors[0].message.statusCode;
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
