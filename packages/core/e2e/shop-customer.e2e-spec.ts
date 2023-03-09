/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { pick } from '@vendure/common/lib/pick';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import { HistoryEntryType } from './graphql/generated-e2e-admin-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import { CreateAddressInput, ErrorCode, UpdateAddressInput } from './graphql/generated-e2e-shop-types';
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
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig());
    let customer: NonNullable<Codegen.GetCustomerQuery['customer']>;

    const successErrorGuard: ErrorResultGuard<{ success: boolean }> = createErrorResultGuard(
        input => input.success != null,
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();

        // Fetch the first Customer and store it as the `customer` variable.
        const { customers } = await adminClient.query<Codegen.GetCustomerIdsQuery>(gql`
            query GetCustomerIds {
                customers {
                    items {
                        id
                    }
                }
            }
        `);
        const result = await adminClient.query<Codegen.GetCustomerQuery, Codegen.GetCustomerQueryVariables>(
            GET_CUSTOMER,
            {
                id: customers.items[0].id,
            },
        );
        customer = result.customer!;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it(
        'updateCustomer throws if not logged in',
        assertThrowsWithMessage(async () => {
            const input: CodegenShop.UpdateCustomerInput = {
                firstName: 'xyz',
            };
            await shopClient.query<
                CodegenShop.UpdateCustomerMutation,
                CodegenShop.UpdateCustomerMutationVariables
            >(UPDATE_CUSTOMER, {
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
            await shopClient.query<
                CodegenShop.CreateAddressShopMutation,
                CodegenShop.CreateAddressShopMutationVariables
            >(CREATE_ADDRESS, {
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
            await shopClient.query<
                CodegenShop.UpdateAddressShopMutation,
                CodegenShop.UpdateAddressShopMutationVariables
            >(UPDATE_ADDRESS, {
                input,
            });
        }, 'You are not currently authorized to perform this action'),
    );

    it(
        'deleteCustomerAddress throws if not logged in',
        assertThrowsWithMessage(async () => {
            await shopClient.query<
                CodegenShop.DeleteAddressShopMutation,
                CodegenShop.DeleteAddressShopMutationVariables
            >(DELETE_ADDRESS, {
                id: 'T_1',
            });
        }, 'You are not currently authorized to perform this action'),
    );

    describe('logged in Customer', () => {
        let addressId: string;

        beforeAll(async () => {
            await shopClient.query<Codegen.AttemptLoginMutation, Codegen.AttemptLoginMutationVariables>(
                ATTEMPT_LOGIN,
                {
                    username: customer.emailAddress,
                    password: 'test',
                    rememberMe: false,
                },
            );
        });

        it('updateCustomer works', async () => {
            const input: CodegenShop.UpdateCustomerInput = {
                firstName: 'xyz',
            };
            const result = await shopClient.query<
                CodegenShop.UpdateCustomerMutation,
                CodegenShop.UpdateCustomerMutationVariables
            >(UPDATE_CUSTOMER, { input });

            expect(result.updateCustomer.firstName).toBe('xyz');
        });

        it('customer history for CUSTOMER_DETAIL_UPDATED', async () => {
            const result = await adminClient.query<
                Codegen.GetCustomerHistoryQuery,
                Codegen.GetCustomerHistoryQueryVariables
            >(GET_CUSTOMER_HISTORY, {
                id: customer.id,
                options: {
                    // skip populated CUSTOMER_ADDRESS_CREATED entry
                    skip: 3,
                },
            });

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
                CodegenShop.CreateAddressShopMutation,
                CodegenShop.CreateAddressShopMutationVariables
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
            const result = await adminClient.query<
                Codegen.GetCustomerHistoryQuery,
                Codegen.GetCustomerHistoryQueryVariables
            >(GET_CUSTOMER_HISTORY, {
                id: customer.id,
                options: {
                    // skip populated CUSTOMER_ADDRESS_CREATED, CUSTOMER_DETAIL_UPDATED entries
                    skip: 4,
                },
            });

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
            const result = await shopClient.query<
                CodegenShop.UpdateAddressShopMutation,
                CodegenShop.UpdateAddressShopMutationVariables
            >(UPDATE_ADDRESS, { input });

            expect(result.updateCustomerAddress.streetLine1).toEqual('5 Test Street');
            expect(result.updateCustomerAddress.country.code).toEqual('AT');
        });

        it('customer history for CUSTOMER_ADDRESS_UPDATED', async () => {
            const result = await adminClient.query<
                Codegen.GetCustomerHistoryQuery,
                Codegen.GetCustomerHistoryQueryVariables
            >(GET_CUSTOMER_HISTORY, { id: customer.id, options: { skip: 5 } });

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
                await shopClient.query<
                    CodegenShop.UpdateAddressShopMutation,
                    CodegenShop.UpdateAddressShopMutationVariables
                >(UPDATE_ADDRESS, { input });
            }, 'You are not currently authorized to perform this action'),
        );

        it('deleteCustomerAddress works', async () => {
            const { deleteCustomerAddress } = await shopClient.query<
                CodegenShop.DeleteAddressShopMutation,
                CodegenShop.DeleteAddressShopMutationVariables
            >(DELETE_ADDRESS, { id: 'T_3' });

            expect(deleteCustomerAddress.success).toBe(true);
        });

        it('customer history for CUSTOMER_ADDRESS_DELETED', async () => {
            const result = await adminClient.query<
                Codegen.GetCustomerHistoryQuery,
                Codegen.GetCustomerHistoryQueryVariables
            >(GET_CUSTOMER_HISTORY, { id: customer!.id, options: { skip: 6 } });

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
                await shopClient.query<
                    CodegenShop.DeleteAddressShopMutation,
                    CodegenShop.DeleteAddressShopMutationVariables
                >(DELETE_ADDRESS, { id: 'T_2' });
            }, 'You are not currently authorized to perform this action'),
        );

        it('updatePassword return error result with incorrect current password', async () => {
            const { updateCustomerPassword } = await shopClient.query<
                CodegenShop.UpdatePasswordMutation,
                CodegenShop.UpdatePasswordMutationVariables
            >(UPDATE_PASSWORD, {
                old: 'wrong',
                new: 'test2',
            });
            successErrorGuard.assertErrorResult(updateCustomerPassword);

            expect(updateCustomerPassword.message).toBe('The provided credentials are invalid');
            expect(updateCustomerPassword.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS_ERROR);
        });

        it('updatePassword works', async () => {
            const { updateCustomerPassword } = await shopClient.query<
                CodegenShop.UpdatePasswordMutation,
                CodegenShop.UpdatePasswordMutationVariables
            >(UPDATE_PASSWORD, { old: 'test', new: 'test2' });
            successErrorGuard.assertSuccess(updateCustomerPassword);

            expect(updateCustomerPassword.success).toBe(true);

            // Log out and log in with new password
            const loginResult = await shopClient.asUserWithCredentials(customer.emailAddress, 'test2');
            expect(loginResult.identifier).toBe(customer.emailAddress);
        });

        it('customer history for CUSTOMER_PASSWORD_UPDATED', async () => {
            const result = await adminClient.query<
                Codegen.GetCustomerHistoryQuery,
                Codegen.GetCustomerHistoryQueryVariables
            >(GET_CUSTOMER_HISTORY, { id: customer.id, options: { skip: 7 } });

            expect(result.customer?.history.items.map(pick(['type', 'data']))).toEqual([
                {
                    type: HistoryEntryType.CUSTOMER_PASSWORD_UPDATED,
                    data: {},
                },
            ]);
        });
    });
});
