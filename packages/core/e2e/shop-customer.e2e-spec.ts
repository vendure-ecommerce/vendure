/* tslint:disable:no-non-null-assertion */
import { pick } from '@vendure/common/lib/pick';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { skip } from 'rxjs/operators';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    AttemptLogin,
    GetCustomer,
    GetCustomerHistory,
    GetCustomerIds,
    HistoryEntryType,
} from './graphql/generated-e2e-admin-types';
import {
    CreateAddressInput,
    CreateAddressShop,
    DeleteAddressShop,
    UpdateAddressInput,
    UpdateAddressShop,
    UpdateCustomer,
    UpdateCustomerInput,
    UpdatePassword,
} from './graphql/generated-e2e-shop-types';
import { ATTEMPT_LOGIN, GET_CUSTOMER, GET_CUSTOMER_HISTORY } from './graphql/shared-definitions';
import {
    CREATE_ADDRESS,
    DELETE_ADDRESS,
    UPDATE_ADDRESS,
    UPDATE_CUSTOMER,
    UPDATE_PASSWORD,
} from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Shop customers', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);
    let customer: GetCustomer.Customer;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();

        // Fetch the first Customer and store it as the `customer` variable.
        const { customers } = await adminClient.query<GetCustomerIds.Query>(gql`
            query GetCustomerIds {
                customers {
                    items {
                        id
                    }
                }
            }
        `);
        const result = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
            id: customers.items[0].id,
        });
        customer = result.customer!;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it(
        'updateCustomer throws if not logged in',
        assertThrowsWithMessage(async () => {
            const input: UpdateCustomerInput = {
                firstName: 'xyz',
            };
            await shopClient.query<UpdateCustomer.Mutation, UpdateCustomer.Variables>(UPDATE_CUSTOMER, {
                input,
            });
        }, 'You are not currently authorized to perform this action'),
    );

    it(
        'createCustomerAddress throws if not logged in',
        assertThrowsWithMessage(async () => {
            const input: CreateAddressInput = {
                streetLine1: '1 Test Street',
                countryCode: 'GB',
            };
            await shopClient.query<CreateAddressShop.Mutation, CreateAddressShop.Variables>(CREATE_ADDRESS, {
                input,
            });
        }, 'You are not currently authorized to perform this action'),
    );

    it(
        'updateCustomerAddress throws if not logged in',
        assertThrowsWithMessage(async () => {
            const input: UpdateAddressInput = {
                id: 'T_1',
                streetLine1: 'zxc',
            };
            await shopClient.query<UpdateAddressShop.Mutation, UpdateAddressShop.Variables>(UPDATE_ADDRESS, {
                input,
            });
        }, 'You are not currently authorized to perform this action'),
    );

    it(
        'deleteCustomerAddress throws if not logged in',
        assertThrowsWithMessage(async () => {
            await shopClient.query<DeleteAddressShop.Mutation, DeleteAddressShop.Variables>(DELETE_ADDRESS, {
                id: 'T_1',
            });
        }, 'You are not currently authorized to perform this action'),
    );

    describe('logged in Customer', () => {
        let addressId: string;

        beforeAll(async () => {
            await shopClient.query<AttemptLogin.Mutation, AttemptLogin.Variables>(ATTEMPT_LOGIN, {
                username: customer.emailAddress,
                password: 'test',
                rememberMe: false,
            });
        });

        it('updateCustomer works', async () => {
            const input: UpdateCustomerInput = {
                firstName: 'xyz',
            };
            const result = await shopClient.query<UpdateCustomer.Mutation, UpdateCustomer.Variables>(
                UPDATE_CUSTOMER,
                { input },
            );

            expect(result.updateCustomer.firstName).toBe('xyz');
        });

        it('customer history for CUSTOMER_DETAIL_UPDATED', async () => {
            const result = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
                GET_CUSTOMER_HISTORY,
                {
                    id: customer.id,
                    options: {
                        // skip populated CUSTOMER_ADDRESS_CREATED entry
                        skip: 3,
                    },
                },
            );

            expect(result.customer?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_DETAIL_UPDATED,
                    data: {
                        input: { firstName: 'xyz', id: 'T_1' },
                    },
                },
            ]);
        });

        it('createCustomerAddress works', async () => {
            const input: CreateAddressInput = {
                streetLine1: '1 Test Street',
                countryCode: 'GB',
            };
            const { createCustomerAddress } = await shopClient.query<
                CreateAddressShop.Mutation,
                CreateAddressShop.Variables
            >(CREATE_ADDRESS, { input });

            expect(createCustomerAddress).toEqual({
                id: 'T_3',
                streetLine1: '1 Test Street',
                country: {
                    code: 'GB',
                },
            });
            addressId = createCustomerAddress.id;
        });

        it('customer history for CUSTOMER_ADDRESS_CREATED', async () => {
            const result = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
                GET_CUSTOMER_HISTORY,
                {
                    id: customer.id,
                    options: {
                        // skip populated CUSTOMER_ADDRESS_CREATED, CUSTOMER_DETAIL_UPDATED entries
                        skip: 4,
                    },
                },
            );

            expect(result.customer?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_ADDRESS_CREATED,
                    data: {
                        address: '1 Test Street, United Kingdom',
                    },
                },
            ]);
        });

        it('updateCustomerAddress works', async () => {
            const input: UpdateAddressInput = {
                id: addressId,
                streetLine1: '5 Test Street',
                countryCode: 'AT',
            };
            const result = await shopClient.query<UpdateAddressShop.Mutation, UpdateAddressShop.Variables>(
                UPDATE_ADDRESS,
                { input },
            );

            expect(result.updateCustomerAddress.streetLine1).toEqual('5 Test Street');
            expect(result.updateCustomerAddress.country.code).toEqual('AT');
        });

        it('customer history for CUSTOMER_ADDRESS_UPDATED', async () => {
            const result = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
                GET_CUSTOMER_HISTORY,
                { id: customer.id, options: { skip: 5 } },
            );

            expect(result.customer?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_ADDRESS_UPDATED,
                    data: {
                        address: '5 Test Street, Austria',
                        input: {
                            id: addressId,
                            streetLine1: '5 Test Street',
                            countryCode: 'AT',
                        },
                    },
                },
            ]);
        });

        it(
            'updateCustomerAddress fails for address not owned by Customer',
            assertThrowsWithMessage(async () => {
                const input: UpdateAddressInput = {
                    id: 'T_2',
                    streetLine1: '1 Test Street',
                };
                await shopClient.query<UpdateAddressShop.Mutation, UpdateAddressShop.Variables>(
                    UPDATE_ADDRESS,
                    { input },
                );
            }, 'You are not currently authorized to perform this action'),
        );

        it('deleteCustomerAddress works', async () => {
            const result = await shopClient.query<DeleteAddressShop.Mutation, DeleteAddressShop.Variables>(
                DELETE_ADDRESS,
                { id: 'T_3' },
            );

            expect(result.deleteCustomerAddress).toBe(true);
        });

        it('customer history for CUSTOMER_ADDRESS_DELETED', async () => {
            const result = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
                GET_CUSTOMER_HISTORY,
                { id: customer.id, options: { skip: 6 } },
            );

            expect(result.customer?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_ADDRESS_DELETED,
                    data: {
                        address: '5 Test Street, Austria',
                    },
                },
            ]);
        });

        it(
            'deleteCustomerAddress fails for address not owned by Customer',
            assertThrowsWithMessage(async () => {
                await shopClient.query<DeleteAddressShop.Mutation, DeleteAddressShop.Variables>(
                    DELETE_ADDRESS,
                    { id: 'T_2' },
                );
            }, 'You are not currently authorized to perform this action'),
        );

        it(
            'updatePassword fails with incorrect current password',
            assertThrowsWithMessage(async () => {
                await shopClient.query<UpdatePassword.Mutation, UpdatePassword.Variables>(UPDATE_PASSWORD, {
                    old: 'wrong',
                    new: 'test2',
                });
            }, 'The credentials did not match. Please check and try again'),
        );

        it('updatePassword works', async () => {
            const response = await shopClient.query<UpdatePassword.Mutation, UpdatePassword.Variables>(
                UPDATE_PASSWORD,
                { old: 'test', new: 'test2' },
            );

            expect(response.updateCustomerPassword).toBe(true);

            // Log out and log in with new password
            const loginResult = await shopClient.asUserWithCredentials(customer.emailAddress, 'test2');
            expect(loginResult.user.identifier).toBe(customer.emailAddress);
        });

        it('customer history for CUSTOMER_PASSWORD_UPDATED', async () => {
            const result = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
                GET_CUSTOMER_HISTORY,
                { id: customer.id, options: { skip: 7 } },
            );

            expect(result.customer?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_PASSWORD_UPDATED,
                    data: {},
                },
            ]);
        });
    });
});
