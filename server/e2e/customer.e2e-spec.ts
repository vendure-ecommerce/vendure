import gql from 'graphql-tag';

import {
    GET_CUSTOMER,
    GET_CUSTOMER_LIST,
} from '../../admin-ui/src/app/data/definitions/customer-definitions';
import { GetCustomer, GetCustomerList } from '../../shared/generated-types';
import { omit } from '../../shared/omit';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestClient } from './test-client';
import { TestServer } from './test-server';

// tslint:disable:no-non-null-assertion

describe('Customer resolver', () => {
    const client = new TestClient();
    const server = new TestServer();
    let firstCustomerId = '';
    let secondCustomerId = '';

    beforeAll(async () => {
        const token = await server.init({
            productCount: 1,
            customerCount: 5,
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('customers list', async () => {
        const result = await client.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
        );

        expect(result.customers.items.length).toBe(5);
        expect(result.customers.totalItems).toBe(5);
        firstCustomerId = result.customers.items[0].id;
        secondCustomerId = result.customers.items[1].id;
    });

    describe('addresses', () => {
        let firstCustomerAddressIds: string[] = [];

        it('createCustomerAddress throws on invalid countryCode', async () => {
            try {
                await client.query(CREATE_ADDRESS, {
                    id: firstCustomerId,
                    input: {
                        streetLine1: 'streetLine1',
                        countryCode: 'INVALID',
                    },
                });
                fail('Should have thrown');
            } catch (err) {
                expect(err.message).toEqual(
                    expect.stringContaining(`The countryCode "INVALID" was not recognized`),
                );
            }
        });

        it('createCustomerAddress creates a new address', async () => {
            const result = await client.query(CREATE_ADDRESS, {
                id: firstCustomerId,
                input: {
                    fullName: 'fullName',
                    company: 'company',
                    streetLine1: 'streetLine1',
                    streetLine2: 'streetLine2',
                    city: 'city',
                    province: 'province',
                    postalCode: 'postalCode',
                    countryCode: 'GB',
                    phoneNumber: 'phoneNumber',
                    defaultShippingAddress: false,
                    defaultBillingAddress: false,
                },
            });
            expect(omit(result.createCustomerAddress, ['id'])).toEqual({
                fullName: 'fullName',
                company: 'company',
                streetLine1: 'streetLine1',
                streetLine2: 'streetLine2',
                city: 'city',
                province: 'province',
                postalCode: 'postalCode',
                countryCode: 'GB',
                country: 'United Kingdom of Great Britain and Northern Ireland',
                phoneNumber: 'phoneNumber',
                defaultShippingAddress: false,
                defaultBillingAddress: false,
            });
        });

        it('customer query returns addresses', async () => {
            const result = await client.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomerId,
            });

            expect(result.customer!.addresses!.length).toBe(2);
            firstCustomerAddressIds = result.customer!.addresses!.map(a => a.id);
        });

        it('updateCustomerAddress allows only a single default address', async () => {
            // set the first customer's second address to be default
            const result1 = await client.query(UPDATE_ADDRESS, {
                input: {
                    id: firstCustomerAddressIds[1],
                    defaultShippingAddress: true,
                    defaultBillingAddress: true,
                },
            });
            expect(result1.updateCustomerAddress.defaultShippingAddress).toBe(true);
            expect(result1.updateCustomerAddress.defaultBillingAddress).toBe(true);

            // assert the first customer's first address is not default
            const result2 = await client.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomerId,
            });
            expect(result2.customer!.addresses![0].defaultShippingAddress).toBe(false);
            expect(result2.customer!.addresses![0].defaultBillingAddress).toBe(false);

            // set the first customer's first address to be default
            const result3 = await client.query(UPDATE_ADDRESS, {
                input: {
                    id: firstCustomerAddressIds[0],
                    defaultShippingAddress: true,
                    defaultBillingAddress: true,
                },
            });
            expect(result3.updateCustomerAddress.defaultShippingAddress).toBe(true);
            expect(result3.updateCustomerAddress.defaultBillingAddress).toBe(true);

            // assert the first customer's second address is not default
            const result4 = await client.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomerId,
            });
            expect(result4.customer!.addresses![1].defaultShippingAddress).toBe(false);
            expect(result4.customer!.addresses![1].defaultBillingAddress).toBe(false);

            // get the second customer's address id
            const result5 = await client.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: secondCustomerId,
            });
            const secondCustomerAddressId = result5.customer!.addresses![0].id;

            // set the second customer's address to be default
            const result6 = await client.query(UPDATE_ADDRESS, {
                input: {
                    id: secondCustomerAddressId,
                    defaultShippingAddress: true,
                    defaultBillingAddress: true,
                },
            });
            expect(result6.updateCustomerAddress.defaultShippingAddress).toBe(true);
            expect(result6.updateCustomerAddress.defaultBillingAddress).toBe(true);

            // assets the first customer's address defaults are unchanged
            const result7 = await client.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomerId,
            });
            expect(result7.customer!.addresses![0].defaultShippingAddress).toBe(true);
            expect(result7.customer!.addresses![0].defaultBillingAddress).toBe(true);
            expect(result7.customer!.addresses![1].defaultShippingAddress).toBe(false);
            expect(result7.customer!.addresses![1].defaultBillingAddress).toBe(false);
        });

        it('createCustomerAddress with true defaults unsets existing defaults', async () => {
            const result1 = await client.query(CREATE_ADDRESS, {
                id: firstCustomerId,
                input: {
                    streetLine1: 'new default streetline',
                    countryCode: 'GB',
                    defaultShippingAddress: true,
                    defaultBillingAddress: true,
                },
            });
            expect(omit(result1.createCustomerAddress, ['id'])).toEqual({
                fullName: '',
                company: '',
                streetLine1: 'new default streetline',
                streetLine2: '',
                city: '',
                province: '',
                postalCode: '',
                countryCode: 'GB',
                country: 'United Kingdom of Great Britain and Northern Ireland',
                phoneNumber: '',
                defaultShippingAddress: true,
                defaultBillingAddress: true,
            });

            const result2 = await client.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomerId,
            });
            expect(result2.customer!.addresses![0].defaultShippingAddress).toBe(false);
            expect(result2.customer!.addresses![0].defaultBillingAddress).toBe(false);
            expect(result2.customer!.addresses![1].defaultShippingAddress).toBe(false);
            expect(result2.customer!.addresses![1].defaultBillingAddress).toBe(false);
            expect(result2.customer!.addresses![2].defaultShippingAddress).toBe(true);
            expect(result2.customer!.addresses![2].defaultBillingAddress).toBe(true);
        });
    });
});

const CREATE_ADDRESS = gql`
    mutation CreateAddress($id: ID!, $input: CreateAddressInput!) {
        createCustomerAddress(customerId: $id, input: $input) {
            id
            fullName
            company
            streetLine1
            streetLine2
            city
            province
            postalCode
            country
            countryCode
            phoneNumber
            defaultShippingAddress
            defaultBillingAddress
        }
    }
`;

const UPDATE_ADDRESS = gql`
    mutation UpdateAddress($input: UpdateAddressInput!) {
        updateCustomerAddress(input: $input) {
            id
            defaultShippingAddress
            defaultBillingAddress
        }
    }
`;
