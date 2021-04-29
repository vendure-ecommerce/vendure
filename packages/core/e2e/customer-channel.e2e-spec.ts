/* tslint:disable:no-non-null-assertion */
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    AddCustomersToGroup,
    CreateAddress,
    CreateChannel,
    CreateCustomer,
    CreateCustomerGroup,
    CurrencyCode,
    DeleteCustomer,
    DeleteCustomerAddress,
    GetCustomerGroup,
    GetCustomerList,
    LanguageCode,
    Me,
    RemoveCustomersFromGroup,
    UpdateAddress,
    UpdateCustomer,
} from './graphql/generated-e2e-admin-types';
import { Register } from './graphql/generated-e2e-shop-types';
import {
    ADD_CUSTOMERS_TO_GROUP,
    CREATE_ADDRESS,
    CREATE_CHANNEL,
    CREATE_CUSTOMER,
    CREATE_CUSTOMER_GROUP,
    DELETE_CUSTOMER,
    GET_CUSTOMER_GROUP,
    GET_CUSTOMER_LIST,
    ME,
    REMOVE_CUSTOMERS_FROM_GROUP,
    UPDATE_ADDRESS,
    UPDATE_CUSTOMER,
} from './graphql/shared-definitions';
import { DELETE_ADDRESS, REGISTER_ACCOUNT } from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('ChannelAware Customers', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);
    const SECOND_CHANNEL_TOKEN = 'second_channel_token';
    let firstCustomer: GetCustomerList.Items;
    let secondCustomer: GetCustomerList.Items;
    let thirdCustomer: GetCustomerList.Items;
    const numberOfCustomers = 3;
    let customerGroupId: string;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: numberOfCustomers,
        });
        await adminClient.asSuperAdmin();

        const { customers } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: { take: numberOfCustomers },
            },
        );
        firstCustomer = customers.items[0];
        secondCustomer = customers.items[1];
        thirdCustomer = customers.items[2];

        await adminClient.query<CreateChannel.Mutation, CreateChannel.Variables>(CREATE_CHANNEL, {
            input: {
                code: 'second-channel',
                token: SECOND_CHANNEL_TOKEN,
                defaultLanguageCode: LanguageCode.en,
                currencyCode: CurrencyCode.GBP,
                pricesIncludeTax: true,
                defaultShippingZoneId: 'T_1',
                defaultTaxZoneId: 'T_1',
            },
        });

        const { createCustomerGroup } = await adminClient.query<
            CreateCustomerGroup.Mutation,
            CreateCustomerGroup.Variables
        >(CREATE_CUSTOMER_GROUP, {
            input: {
                name: 'TestGroup',
            },
        });
        customerGroupId = createCustomerGroup.id;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('Address manipulation', () => {
        it(
            'throws when updating address from customer from other channel',
            assertThrowsWithMessage(async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                await adminClient.query<UpdateAddress.Mutation, UpdateAddress.Variables>(UPDATE_ADDRESS, {
                    input: {
                        id: 'T_1',
                        streetLine1: 'Dummy street',
                    },
                });
            }, `No Address with the id '1' could be found`),
        );

        it(
            'throws when creating address for customer from other channel',
            assertThrowsWithMessage(async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                await adminClient.query<CreateAddress.Mutation, CreateAddress.Variables>(CREATE_ADDRESS, {
                    id: firstCustomer.id,
                    input: {
                        streetLine1: 'Dummy street',
                        countryCode: 'BE',
                    },
                });
            }, `No Customer with the id '1' could be found`),
        );

        it(
            'throws when deleting address from customer from other channel',
            assertThrowsWithMessage(async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                await adminClient.query<DeleteCustomerAddress.Mutation, DeleteCustomerAddress.Variables>(
                    DELETE_ADDRESS,
                    {
                        id: 'T_1',
                    },
                );
            }, `No Address with the id '1' could be found`),
        );
    });

    describe('Customer manipulation', () => {
        it(
            'throws when deleting customer from other channel',
            assertThrowsWithMessage(async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                await adminClient.query<DeleteCustomer.Mutation, DeleteCustomer.Variables>(DELETE_CUSTOMER, {
                    id: firstCustomer.id,
                });
            }, `No Customer with the id '1' could be found`),
        );

        it(
            'throws when updating customer from other channel',
            assertThrowsWithMessage(async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                await adminClient.query<UpdateCustomer.Mutation, UpdateCustomer.Variables>(UPDATE_CUSTOMER, {
                    input: {
                        id: firstCustomer.id,
                        firstName: 'John',
                        lastName: 'Doe',
                    },
                });
            }, `No Customer with the id '1' could be found`),
        );

        it('creates customers on current and default channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            await adminClient.query<CreateCustomer.Mutation, CreateCustomer.Variables>(CREATE_CUSTOMER, {
                input: {
                    firstName: 'John',
                    lastName: 'Doe',
                    emailAddress: 'john.doe@test.com',
                },
            });
            const customersSecondChannel = await adminClient.query<
                GetCustomerList.Query,
                GetCustomerList.Variables
            >(GET_CUSTOMER_LIST);
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const customersDefaultChannel = await adminClient.query<
                GetCustomerList.Query,
                GetCustomerList.Variables
            >(GET_CUSTOMER_LIST);

            expect(customersSecondChannel.customers.totalItems).toBe(1);
            expect(customersDefaultChannel.customers.totalItems).toBe(numberOfCustomers + 1);
        });

        it('only shows customers from current channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { customers } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
            );
            expect(customers.totalItems).toBe(1);
        });

        it('shows all customers on default channel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { customers } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
            );
            expect(customers.totalItems).toBe(numberOfCustomers + 1);
        });

        it('brings customer to current channel when creating with existing emailAddress', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            let customersDefaultChannel = await adminClient.query<
                GetCustomerList.Query,
                GetCustomerList.Variables
            >(GET_CUSTOMER_LIST);
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            let customersSecondChannel = await adminClient.query<
                GetCustomerList.Query,
                GetCustomerList.Variables
            >(GET_CUSTOMER_LIST);
            expect(customersDefaultChannel.customers.items.map(customer => customer.emailAddress)).toContain(
                firstCustomer.emailAddress,
            );
            expect(
                customersSecondChannel.customers.items.map(customer => customer.emailAddress),
            ).not.toContain(firstCustomer.emailAddress);

            await adminClient.query<CreateCustomer.Mutation, CreateCustomer.Variables>(CREATE_CUSTOMER, {
                input: {
                    firstName: firstCustomer.firstName + '_new',
                    lastName: firstCustomer.lastName + '_new',
                    emailAddress: firstCustomer.emailAddress,
                },
            });

            customersSecondChannel = await adminClient.query<
                GetCustomerList.Query,
                GetCustomerList.Variables
            >(GET_CUSTOMER_LIST);
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            customersDefaultChannel = await adminClient.query<
                GetCustomerList.Query,
                GetCustomerList.Variables
            >(GET_CUSTOMER_LIST);
            const firstCustomerOnNewChannel = customersSecondChannel.customers.items.find(
                customer => customer.emailAddress === firstCustomer.emailAddress,
            );
            const firstCustomerOnDefaultChannel = customersDefaultChannel.customers.items.find(
                customer => customer.emailAddress === firstCustomer.emailAddress,
            );

            expect(firstCustomerOnNewChannel).not.toBeNull();
            expect(firstCustomerOnNewChannel?.emailAddress).toBe(firstCustomer.emailAddress);
            expect(firstCustomerOnNewChannel?.firstName).toBe(firstCustomer.firstName + '_new');
            expect(firstCustomerOnNewChannel?.lastName).toBe(firstCustomer.lastName + '_new');

            expect(firstCustomerOnDefaultChannel).not.toBeNull();
            expect(firstCustomerOnDefaultChannel?.emailAddress).toBe(firstCustomer.emailAddress);
            expect(firstCustomerOnDefaultChannel?.firstName).toBe(firstCustomer.firstName + '_new');
            expect(firstCustomerOnDefaultChannel?.lastName).toBe(firstCustomer.lastName + '_new');
        });
    });

    describe('Shop API', () => {
        it('assigns authenticated customers to the channels they visit', async () => {
            shopClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            await shopClient.asUserWithCredentials(secondCustomer.emailAddress, 'test');
            await shopClient.query<Me.Query>(ME);

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { customers } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
            );
            expect(customers.totalItems).toBe(3);
            expect(customers.items.map(customer => customer.emailAddress)).toContain(
                secondCustomer.emailAddress,
            );
        });

        it('assigns newly registered customers to channel', async () => {
            shopClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            await shopClient.asAnonymousUser();
            await shopClient.query<Register.Mutation, Register.Variables>(REGISTER_ACCOUNT, {
                input: {
                    emailAddress: 'john.doe.2@test.com',
                },
            });

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { customers } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
            );
            expect(customers.totalItems).toBe(4);
            expect(customers.items.map(customer => customer.emailAddress)).toContain('john.doe.2@test.com');
        });

        // https://github.com/vendure-ecommerce/vendure/issues/834
        it('handles concurrent assignments to a new channel', async () => {
            const THIRD_CHANNEL_TOKEN = 'third_channel_token';
            await adminClient.query<CreateChannel.Mutation, CreateChannel.Variables>(CREATE_CHANNEL, {
                input: {
                    code: 'third-channel',
                    token: THIRD_CHANNEL_TOKEN,
                    defaultLanguageCode: LanguageCode.en,
                    currencyCode: CurrencyCode.GBP,
                    pricesIncludeTax: true,
                    defaultShippingZoneId: 'T_1',
                    defaultTaxZoneId: 'T_1',
                },
            });

            await shopClient.asUserWithCredentials(secondCustomer.emailAddress, 'test');
            shopClient.setChannelToken(THIRD_CHANNEL_TOKEN);

            try {
                await Promise.all([shopClient.query<Me.Query>(ME), shopClient.query<Me.Query>(ME)]);
            } catch (e) {
                fail('Threw: ' + e.message);
            }

            adminClient.setChannelToken(THIRD_CHANNEL_TOKEN);
            const { customers } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
                GET_CUSTOMER_LIST,
            );
            expect(customers.totalItems).toBe(1);
            expect(customers.items.map(customer => customer.emailAddress)).toContain(
                secondCustomer.emailAddress,
            );
        });
    });

    describe('Customergroup manipulation', () => {
        it('does not add a customer from another channel to customerGroup', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            await adminClient.query<AddCustomersToGroup.Mutation, AddCustomersToGroup.Variables>(
                ADD_CUSTOMERS_TO_GROUP,
                {
                    groupId: customerGroupId,
                    customerIds: [thirdCustomer.id],
                },
            );

            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { customerGroup } = await adminClient.query<
                GetCustomerGroup.Query,
                GetCustomerGroup.Variables
            >(GET_CUSTOMER_GROUP, {
                id: customerGroupId,
            });
            expect(customerGroup!.customers.totalItems).toBe(0);
        });

        it('only shows customers from current channel in customerGroup', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            await adminClient.query<AddCustomersToGroup.Mutation, AddCustomersToGroup.Variables>(
                ADD_CUSTOMERS_TO_GROUP,
                {
                    groupId: customerGroupId,
                    customerIds: [secondCustomer.id, thirdCustomer.id],
                },
            );

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { customerGroup } = await adminClient.query<
                GetCustomerGroup.Query,
                GetCustomerGroup.Variables
            >(GET_CUSTOMER_GROUP, {
                id: customerGroupId,
            });
            expect(customerGroup!.customers.totalItems).toBe(1);
            expect(customerGroup!.customers.items.map(customer => customer.id)).toContain(secondCustomer.id);
        });

        it('throws when deleting customer from other channel from customerGroup', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            await adminClient.query<RemoveCustomersFromGroup.Mutation, RemoveCustomersFromGroup.Variables>(
                REMOVE_CUSTOMERS_FROM_GROUP,
                {
                    groupId: customerGroupId,
                    customerIds: [thirdCustomer.id],
                },
            );
        });
    });
});
