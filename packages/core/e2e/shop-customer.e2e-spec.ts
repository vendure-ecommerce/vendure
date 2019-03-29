/* tslint:disable:no-non-null-assertion */
import { CreateAddressInput, UpdateAddressInput, UpdateCustomerInput } from '@vendure/common/generated-shop-types';
import { AttemptLogin, GetCustomer } from '@vendure/common/generated-types';
import gql from 'graphql-tag';
import path from 'path';

import { ATTEMPT_LOGIN } from '../../../admin-ui/src/app/data/definitions/auth-definitions';
import { CUSTOMER_FRAGMENT, GET_CUSTOMER } from '../../../admin-ui/src/app/data/definitions/customer-definitions';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Shop customers', () => {
    const shopClient = new TestShopClient();
    const adminClient = new TestAdminClient();
    const server = new TestServer();
    let customer: GetCustomer.Customer;

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 2,
        });
        await shopClient.init();
        await adminClient.init();

        // Fetch the first Customer and store it as the `customer` variable.
        const { customers } = await adminClient.query(gql`
            query {
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
            await shopClient.query(UPDATE_CUSTOMER, { input });
        }, 'You are not currently authorized to perform this action'),
    );

    it(
        'createCustomerAddress throws if not logged in',
        assertThrowsWithMessage(async () => {
            const input: CreateAddressInput = {
                streetLine1: '1 Test Street',
                countryCode: 'GB',
            };
            await shopClient.query(CREATE_ADDRESS, { input });
        }, 'You are not currently authorized to perform this action'),
    );

    it(
        'updateCustomerAddress throws if not logged in',
        assertThrowsWithMessage(async () => {
            const input: UpdateAddressInput = {
                id: 'T_1',
                streetLine1: 'zxc',
            };
            await shopClient.query(UPDATE_ADDRESS, { input });
        }, 'You are not currently authorized to perform this action'),
    );

    it(
        'deleteCustomerAddress throws if not logged in',
        assertThrowsWithMessage(async () => {
            await shopClient.query(DELETE_ADDRESS, { id: 'T_1' });
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
            const result = await shopClient.query(UPDATE_CUSTOMER, { input });

            expect(result.updateCustomer.firstName).toBe('xyz');
        });

        it('createCustomerAddress works', async () => {
            const input: CreateAddressInput = {
                streetLine1: '1 Test Street',
                countryCode: 'GB',
            };
            const { createCustomerAddress } = await shopClient.query(CREATE_ADDRESS, { input });

            expect(createCustomerAddress).toEqual({
                id: 'T_3',
                streetLine1: '1 Test Street',
                country: {
                    code: 'GB',
                },
            });
            addressId = createCustomerAddress.id;
        });

        it('updateCustomerAddress works', async () => {
            const input: UpdateAddressInput = {
                id: addressId,
                streetLine1: '5 Test Street',
            };
            const result = await shopClient.query(UPDATE_ADDRESS, { input });

            expect(result.updateCustomerAddress.streetLine1).toEqual('5 Test Street');
        });

        it(
            'updateCustomerAddress fails for address not owned by Customer',
            assertThrowsWithMessage(async () => {
                const input: UpdateAddressInput = {
                    id: 'T_2',
                    streetLine1: '1 Test Street',
                };
                await shopClient.query(UPDATE_ADDRESS, { input });
            }, 'You are not currently authorized to perform this action'),
        );

        it('deleteCustomerAddress works', async () => {
            const result = await shopClient.query(DELETE_ADDRESS, { id: 'T_3' });

            expect(result.deleteCustomerAddress).toBe(true);
        });

        it(
            'deleteCustomerAddress fails for address not owned by Customer',
            assertThrowsWithMessage(async () => {
                await shopClient.query(DELETE_ADDRESS, { id: 'T_2' });
            }, 'You are not currently authorized to perform this action'),
        );

        it(
            'updatePassword fails with incorrect current password',
            assertThrowsWithMessage(async () => {
                await shopClient.query(UPDATE_PASSWORD, { old: 'wrong', new: 'test2' });
            }, 'The credentials did not match. Please check and try again'),
        );

        it('updatePassword works', async () => {
            const response = await shopClient.query(UPDATE_PASSWORD, { old: 'test', new: 'test2' });

            expect(response.updateCustomerPassword).toBe(true);

            // Log out and log in with new password
            const loginResult = await shopClient.asUserWithCredentials(customer.emailAddress, 'test2');
            expect(loginResult.user.identifier).toBe(customer.emailAddress);
        });
    });
});

const CREATE_ADDRESS = gql`
    mutation CreateAddress($input: CreateAddressInput!) {
        createCustomerAddress(input: $input) {
            id
            streetLine1
            country {
                code
            }
        }
    }
`;

const UPDATE_ADDRESS = gql`
    mutation UpdateAddress($input: UpdateAddressInput!) {
        updateCustomerAddress(input: $input) {
            streetLine1
            country {
                code
            }
        }
    }
`;

const DELETE_ADDRESS = gql`
    mutation DeleteAddress($id: ID!) {
        deleteCustomerAddress(id: $id)
    }
`;

const UPDATE_CUSTOMER = gql`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            ...Customer
        }
    }
    ${CUSTOMER_FRAGMENT}
`;

const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($old: String!, $new: String!) {
        updateCustomerPassword(currentPassword: $old, newPassword: $new)
    }
`;
