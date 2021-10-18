/* tslint:disable:no-non-null-assertion */
import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '@vendure/common/lib/shared-constants';
import { createTestEnvironment } from '@vendure/testing';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { ProtectedFieldsPlugin, transactions } from './fixtures/test-plugins/with-protected-field-resolver';
import {
    CreateAdministrator,
    CreateCustomerGroup,
    CreateRole,
    ErrorCode,
    GetCustomerList,
    GetTaxRates,
    Me,
    MutationCreateProductArgs,
    MutationLoginArgs,
    MutationUpdateProductArgs,
    Permission,
    UpdateTaxRate,
} from './graphql/generated-e2e-admin-types';
import {
    ATTEMPT_LOGIN,
    CREATE_ADMINISTRATOR,
    CREATE_CUSTOMER_GROUP,
    CREATE_PRODUCT,
    CREATE_ROLE,
    GET_CUSTOMER_LIST,
    GET_PRODUCT_LIST,
    GET_TAX_RATES_LIST,
    ME,
    UPDATE_PRODUCT,
    UPDATE_TAX_RATE,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Authorization & permissions', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        plugins: [ProtectedFieldsPlugin],
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 5,
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

        describe('Customer user', () => {
            let customerEmailAddress: string;
            beforeAll(async () => {
                await adminClient.asSuperAdmin();
                const { customers } = await adminClient.query<GetCustomerList.Query>(GET_CUSTOMER_LIST);
                customerEmailAddress = customers.items[0].emailAddress;
            });

            it('cannot login', async () => {
                const result = await adminClient.asUserWithCredentials(customerEmailAddress, 'test');

                expect(result.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
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

            it('cannot update', async () => {
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
                    gql(`mutation CanCreateCustomer($input: CreateCustomerInput!) {
                            createCustomer(input: $input) {
                                ... on Customer {
                                    id
                                }
                            }
                        }
                    `),
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

    describe('protected field resolvers', () => {
        let readCatalogAdmin: { identifier: string; password: string };
        let transactionsAdmin: { identifier: string; password: string };

        const GET_PRODUCT_WITH_TRANSACTIONS = `
            query GetProductWithTransactions($id: ID!) {
                product(id: $id) {
                  id
                  transactions {
                      id
                      amount
                      description
                  }
                }
            }
        `;

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            transactionsAdmin = await createAdministratorWithPermissions('Transactions', [
                Permission.ReadCatalog,
                transactions.Permission,
            ]);
            readCatalogAdmin = await createAdministratorWithPermissions('ReadCatalog', [
                Permission.ReadCatalog,
            ]);
        });

        it('protected field not resolved without permissions', async () => {
            await adminClient.asUserWithCredentials(readCatalogAdmin.identifier, readCatalogAdmin.password);

            try {
                const status = await adminClient.query(gql(GET_PRODUCT_WITH_TRANSACTIONS), { id: 'T_1' });
                fail(`Should have thrown`);
            } catch (e) {
                expect(getErrorCode(e)).toBe('FORBIDDEN');
            }
        });

        it('protected field is resolved with permissions', async () => {
            await adminClient.asUserWithCredentials(transactionsAdmin.identifier, transactionsAdmin.password);

            const { product } = await adminClient.query(gql(GET_PRODUCT_WITH_TRANSACTIONS), { id: 'T_1' });

            expect(product.id).toBe('T_1');
            expect(product.transactions).toEqual([
                { id: 'T_1', amount: 100, description: 'credit' },
                { id: 'T_2', amount: -50, description: 'debit' },
            ]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/730
        it('protects against deep query data leakage', async () => {
            await adminClient.asSuperAdmin();
            const { createCustomerGroup } = await adminClient.query<
                CreateCustomerGroup.Mutation,
                CreateCustomerGroup.Variables
            >(CREATE_CUSTOMER_GROUP, {
                input: {
                    name: 'Test group',
                    customerIds: ['T_1', 'T_2', 'T_3', 'T_4'],
                },
            });

            const taxRateName = `Standard Tax ${initialData.defaultZone}`;
            const { taxRates } = await adminClient.query<GetTaxRates.Query, GetTaxRates.Variables>(
                GET_TAX_RATES_LIST,
                {
                    options: {
                        filter: {
                            name: { eq: taxRateName },
                        },
                    },
                },
            );

            const standardTax = taxRates.items[0];
            expect(standardTax.name).toBe(taxRateName);

            await adminClient.query<UpdateTaxRate.Mutation, UpdateTaxRate.Variables>(UPDATE_TAX_RATE, {
                input: {
                    id: standardTax.id,
                    customerGroupId: createCustomerGroup.id,
                },
            });

            try {
                const status = await shopClient.query(
                    gql(`
                query DeepFieldResolutionTestQuery{
                  product(id: "T_1") {
                    variants {
                      taxRateApplied {
                        customerGroup {
                          customers {
                            items {
                              id
                              emailAddress
                            }
                          }
                        }
                      }
                    }
                  }
                }`),
                    { id: 'T_1' },
                );
                fail(`Should have thrown`);
            } catch (e) {
                expect(getErrorCode(e)).toBe('FORBIDDEN');
            }
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

        const identifier = `${code}@${Math.random().toString(16).substr(2, 8)}`;
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
