import { CreateCustomerAddress, DeletionResult, GetCustomer, GetCustomerList, UpdateCustomer } from '@vendure/common/generated-types';
import { omit } from '@vendure/common/omit';
import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_CUSTOMER_ADDRESS,
    GET_CUSTOMER,
    GET_CUSTOMER_LIST,
    UPDATE_CUSTOMER,
} from '../../../admin-ui/src/app/data/definitions/customer-definitions';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

// tslint:disable:no-non-null-assertion

describe('Customer resolver', () => {
    const adminClient = new TestAdminClient();
    const shopClient = new TestShopClient();
    const server = new TestServer();
    let firstCustomer: GetCustomerList.Items;
    let secondCustomer: GetCustomerList.Items;
    let thirdCustomer: GetCustomerList.Items;

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 5,
        });
        await adminClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('customers list', async () => {
        const result = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
        );

        expect(result.customers.items.length).toBe(5);
        expect(result.customers.totalItems).toBe(5);
        firstCustomer = result.customers.items[0];
        secondCustomer = result.customers.items[1];
        thirdCustomer = result.customers.items[2];
    });

    describe('addresses', () => {
        let firstCustomerAddressIds: string[] = [];
        let firstCustomerThirdAddressId: string;

        it(
            'createCustomerAddress throws on invalid countryCode',
            assertThrowsWithMessage(
                () =>
                    adminClient.query(CREATE_ADDRESS, {
                        id: firstCustomer.id,
                        input: {
                            streetLine1: 'streetLine1',
                            countryCode: 'INVALID',
                        },
                    }),
                `The countryCode "INVALID" was not recognized`,
            ),
        );

        it('createCustomerAddress creates a new address', async () => {
            const result = await adminClient.query(CREATE_ADDRESS, {
                id: firstCustomer.id,
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
                country: {
                    code: 'GB',
                    name: 'United Kingdom',
                },
                phoneNumber: 'phoneNumber',
                defaultShippingAddress: false,
                defaultBillingAddress: false,
            });
        });

        it('customer query returns addresses', async () => {
            const result = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomer.id,
            });

            expect(result.customer!.addresses!.length).toBe(2);
            firstCustomerAddressIds = result.customer!.addresses!.map(a => a.id);
        });

        it('updateCustomerAddress allows only a single default address', async () => {
            // set the first customer's second address to be default
            const result1 = await adminClient.query(UPDATE_ADDRESS, {
                input: {
                    id: firstCustomerAddressIds[1],
                    defaultShippingAddress: true,
                    defaultBillingAddress: true,
                },
            });
            expect(result1.updateCustomerAddress.defaultShippingAddress).toBe(true);
            expect(result1.updateCustomerAddress.defaultBillingAddress).toBe(true);

            // assert the first customer's first address is not default
            const result2 = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomer.id,
            });
            expect(result2.customer!.addresses![0].defaultShippingAddress).toBe(false);
            expect(result2.customer!.addresses![0].defaultBillingAddress).toBe(false);

            // set the first customer's first address to be default
            const result3 = await adminClient.query(UPDATE_ADDRESS, {
                input: {
                    id: firstCustomerAddressIds[0],
                    defaultShippingAddress: true,
                    defaultBillingAddress: true,
                },
            });
            expect(result3.updateCustomerAddress.defaultShippingAddress).toBe(true);
            expect(result3.updateCustomerAddress.defaultBillingAddress).toBe(true);

            // assert the first customer's second address is not default
            const result4 = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomer.id,
            });
            expect(result4.customer!.addresses![1].defaultShippingAddress).toBe(false);
            expect(result4.customer!.addresses![1].defaultBillingAddress).toBe(false);

            // get the second customer's address id
            const result5 = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: secondCustomer.id,
            });
            const secondCustomerAddressId = result5.customer!.addresses![0].id;

            // set the second customer's address to be default
            const result6 = await adminClient.query(UPDATE_ADDRESS, {
                input: {
                    id: secondCustomerAddressId,
                    defaultShippingAddress: true,
                    defaultBillingAddress: true,
                },
            });
            expect(result6.updateCustomerAddress.defaultShippingAddress).toBe(true);
            expect(result6.updateCustomerAddress.defaultBillingAddress).toBe(true);

            // assets the first customer's address defaults are unchanged
            const result7 = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomer.id,
            });
            expect(result7.customer!.addresses![0].defaultShippingAddress).toBe(true);
            expect(result7.customer!.addresses![0].defaultBillingAddress).toBe(true);
            expect(result7.customer!.addresses![1].defaultShippingAddress).toBe(false);
            expect(result7.customer!.addresses![1].defaultBillingAddress).toBe(false);
        });

        it('createCustomerAddress with true defaults unsets existing defaults', async () => {
            const result1 = await adminClient.query(CREATE_ADDRESS, {
                id: firstCustomer.id,
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
                country: {
                    code: 'GB',
                    name: 'United Kingdom',
                },
                phoneNumber: '',
                defaultShippingAddress: true,
                defaultBillingAddress: true,
            });

            const result2 = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomer.id,
            });
            expect(result2.customer!.addresses![0].defaultShippingAddress).toBe(false);
            expect(result2.customer!.addresses![0].defaultBillingAddress).toBe(false);
            expect(result2.customer!.addresses![1].defaultShippingAddress).toBe(false);
            expect(result2.customer!.addresses![1].defaultBillingAddress).toBe(false);
            expect(result2.customer!.addresses![2].defaultShippingAddress).toBe(true);
            expect(result2.customer!.addresses![2].defaultBillingAddress).toBe(true);

            firstCustomerThirdAddressId = result2.customer!.addresses![2].id;
        });

        it('deleteCustomerAddress on default address resets defaults', async () => {
            const result = await adminClient.query(
                gql`
                    mutation DeleteCustomerAddress($id: ID!) {
                        deleteCustomerAddress(id: $id)
                    }
                `,
                { id: firstCustomerThirdAddressId },
            );

            expect(result.deleteCustomerAddress).toBe(true);

            const result2 = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: firstCustomer.id,
            });
            expect(result2.customer!.addresses!.length).toBe(2);
            expect(result2.customer!.addresses![0].defaultShippingAddress).toBe(true);
            expect(result2.customer!.addresses![0].defaultBillingAddress).toBe(true);
            expect(result2.customer!.addresses![1].defaultShippingAddress).toBe(false);
            expect(result2.customer!.addresses![1].defaultBillingAddress).toBe(false);
        });
    });

    describe('orders', () => {
        it(`lists that user\'s orders`, async () => {
            // log in as first customer
            await shopClient.asUserWithCredentials(firstCustomer.emailAddress, 'test');
            // add an item to the order to create an order
            const result1 = await shopClient.query(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            const result2 = await adminClient.query(GET_CUSTOMER_ORDERS, { id: firstCustomer.id });

            expect(result2.customer.orders.totalItems).toBe(1);
            expect(result2.customer.orders.items[0].id).toBe(result1.addItemToOrder.id);
        });
    });

    describe('deletion', () => {
        it('deletes a customer', async () => {
            const result = await adminClient.query(DELETE_CUSTOMER, { id: thirdCustomer.id });

            expect(result.deleteCustomer).toEqual({ result: DeletionResult.DELETED });
        });

        it('cannot get a deleted customer', async () => {
            const result = await adminClient.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
                id: thirdCustomer.id,
            });

            expect(result.customer).toBe(null);
        });

        it('deleted customer omitted from list', async () => {
            const result = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
            );

            expect(result.customers.items.map(c => c.id).includes(thirdCustomer.id)).toBe(false);
        });

        it(
            'updateCustomer throws for deleted customer',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<UpdateCustomer.Mutation, UpdateCustomer.Variables>(UPDATE_CUSTOMER, {
                        input: {
                            id: thirdCustomer.id,
                            firstName: 'updated',
                        },
                    }),
                `No Customer with the id '3' could be found`,
            ),
        );

        it(
            'createCustomerAddress throws for deleted customer',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<CreateCustomerAddress.Mutation, CreateCustomerAddress.Variables>(
                        CREATE_CUSTOMER_ADDRESS,
                        {
                            customerId: thirdCustomer.id,
                            input: {
                                streetLine1: 'test',
                                countryCode: 'GB',
                            },
                        },
                    ),
                `No Customer with the id '3' could be found`,
            ),
        );
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
            country {
                code
                name
            }
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

const ADD_ITEM_TO_ORDER = gql`
    mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
        addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
            id
        }
    }
`;

const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders($id: ID!) {
        customer(id: $id) {
            orders {
                items {
                    id
                }
                totalItems
            }
        }
    }
`;

const DELETE_CUSTOMER = gql`
    mutation DeleteCustomer($id: ID!) {
        deleteCustomer(id: $id) {
            result
        }
    }
`;
