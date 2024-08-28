/* eslint-disable @typescript-eslint/no-non-null-assertion, no-console */
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import {
    DefaultJobQueuePlugin,
    mergeConfig,
    OrderService,
    Order,
    VendureEvent,
    RequestContext,
    Customer,
    CustomerService,
    isGraphQlErrorResult,
    EventBus,
    ID,
} from '@vendure/core';
import { awaitRunningJobs } from '@vendure/core/e2e/utils/await-running-jobs';
import { GET_CUSTOMER_LIST } from '@vendure/payments-plugin/e2e/graphql/admin-queries';
import {
    GetCustomerListQuery,
    GetCustomerListQueryVariables,
} from '@vendure/payments-plugin/e2e/graphql/generated-admin-types';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it, Mock, vi } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { EmailEventResend } from '../src/email-event-resend-event';
import { EmailEventListener } from '../src/event-listener';
import { EmailPlugin } from '../src/plugin';
import { FileBasedTemplateLoader } from '../src/template-loader/file-based-template-loader';

import { addItemToOrder, createCustomerAndLogin } from './email-plugin-e2e-helpers';
import {
    GetEmailEventsForResendDocument,
    LanguageCode,
    ResendEmailEventDocument,
} from './graphql/generated-admin-types';

const pause = () => new Promise(resolve => setTimeout(resolve, 1000));

class MockEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public shouldSend: boolean,
    ) {
        super();
    }
}

const testOrderConfirmationHandler = new EmailEventListener('test-order-confirmation')
    .on(MockEvent)
    .setResendOptions({
        entityType: Order,
        label: [
            {
                value: 'Resend order confirmation',
                languageCode: LanguageCode.en,
            },
        ],
        description: [
            {
                value: 'Resend order confirmation. It can be send only for specific reasons',
                languageCode: LanguageCode.en,
            },
        ],
        operationDefinitions: {
            code: 'test-order-confirmation',
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Resend order confirmation',
                },
            ],
            args: {
                testBoolean: {
                    type: 'boolean',
                    required: true,
                    ui: { component: 'boolean-form-input' },
                    label: [{ languageCode: LanguageCode.en, value: 'Test boolean' }],
                },
                testNumber: {
                    type: 'int',
                    required: true,
                    ui: { component: 'number-form-input' },
                    label: [{ languageCode: LanguageCode.en, value: 'Test number' }],
                },
            },
        },
        canResend: (_ctx, _injector, entity) => {
            if (!(entity instanceof Order)) throw new Error(`Wrong entity ${typeof entity}`);
            return true;
        },
        createEvent: async (ctx, injector, entity, _args) => {
            const completeOrderEntity = await injector.get(OrderService).findOne(ctx, entity.id);
            if (!(entity instanceof Order)) throw new Error(`Wrong entity ${typeof entity}`);
            if (!completeOrderEntity) {
                throw new Error('Order not found');
            }
            return new MockEvent(ctx, true);
        },
    })
    .setFrom('"test from" <noreply@test.com>')
    .setRecipient(() => 'test@test.com')
    .setSubject('Order confirmation');

const testOrderConfirmationWithoutOperationHandler = new EmailEventListener(
    'test-order-confirmation-without-operation',
)
    .on(MockEvent)
    .setResendOptions({
        entityType: Order,
        label: [
            {
                value: 'Resend order confirmation without operation',
                languageCode: LanguageCode.en,
            },
        ],
        description: [
            {
                value: 'Resend order confirmation without args. It can be send only for specific reasons',
                languageCode: LanguageCode.en,
            },
        ],
        canResend: (_ctx, _injector, entity) => {
            if (!(entity instanceof Order)) throw new Error(`Wrong entity ${typeof entity}`);
            return true;
        },
        createEvent: async (ctx, injector, entity, _args) => {
            const completeOrderEntity = await injector.get(OrderService).findOne(ctx, entity.id);
            if (!(entity instanceof Order)) throw new Error(`Wrong entity ${typeof entity}`);
            if (!completeOrderEntity) {
                throw new Error('Order not found');
            }
            return new MockEvent(ctx, true);
        },
    })
    .setFrom('"test from" <noreply@test.com>')
    .setRecipient(() => 'test@test.com')
    .setSubject('Order confirmation without operation');

const testCustomerEmail = new EmailEventListener('test-customer-resend')
    .on(MockEvent)

    .setResendOptions({
        entityType: Customer,
        label: [
            {
                value: 'Resend customer test email',
                languageCode: LanguageCode.en,
            },
        ],
        description: [
            {
                value: 'Resend customer test email. It can be send only for specific reasons',
                languageCode: LanguageCode.en,
            },
        ],
        operationDefinitions: {
            code: 'test-customer',
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Resend customer test email',
                },
            ],
            args: {
                testBoolean: {
                    type: 'boolean',
                    required: true,
                    ui: { component: 'boolean-form-input' },
                    label: [{ languageCode: LanguageCode.en, value: 'Test boolean' }],
                },
                testNumber: {
                    type: 'int',
                    required: true,
                    ui: { component: 'number-form-input' },
                    label: [{ languageCode: LanguageCode.en, value: 'Test number' }],
                },
            },
        },
        canResend: (_ctx, _injector, entity) => {
            if (!(entity instanceof Customer)) throw new Error(`Wrong entity ${typeof entity}`);
            return true;
        },
        createEvent: async (ctx, injector, entity, args) => {
            if (!(entity instanceof Customer)) throw new Error(`Wrong entity ${typeof entity}`);
            const completeOrderEntity = await injector.get(CustomerService).findOne(ctx, entity.id);
            if (!completeOrderEntity) {
                throw new Error('Customer not found');
            }
            if (!args || args.testBoolean === undefined || args.testNumber === undefined) {
                throw new Error('Args are not defined');
            }
            return new MockEvent(ctx, true);
        },
    })
    .setFrom('"test from" <noreply@test.com>')
    .setRecipient(() => 'test@test.com')
    .setSubject('Test customer');

describe('Email resend admin api', () => {
    let eventBus: EventBus;
    const onSend: Mock = vi.fn();
    let customers: GetCustomerListQuery['customers']['items'];
    let customerId: ID;

    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [
                EmailPlugin.init({
                    templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../test-templates')),
                    transport: {
                        type: 'testing',
                        onSend,
                    },
                    handlers: [
                        testOrderConfirmationHandler,
                        testOrderConfirmationWithoutOperationHandler,
                        testCustomerEmail,
                    ],
                }),
                DefaultJobQueuePlugin,
            ],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-one-product.csv'),
            customerCount: 1,
        });
        eventBus = server.app.get(EventBus);
        await adminClient.asSuperAdmin();
        ({
            customers: { items: customers },
        } = await adminClient.query<GetCustomerListQuery, GetCustomerListQueryVariables>(GET_CUSTOMER_LIST, {
            options: {
                take: 1,
            },
        }));
        customerId = customers[0].id;
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await addItemToOrder(shopClient, 'T_1', 1);
        await awaitRunningJobs(adminClient);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await awaitRunningJobs(adminClient);
        await server.destroy();
    });

    describe('admin api', () => {
        it('test ResendEmailEvent publish and process', async () => {
            onSend.mockClear();
            const ctx = RequestContext.deserialize({
                _channel: { code: DEFAULT_CHANNEL_CODE },
                _languageCode: LanguageCode.en,
            } as any);
            await eventBus.publish(
                new EmailEventResend(testOrderConfirmationHandler as any, new MockEvent(ctx, true)),
            );
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Order confirmation');
            expect(onSend.mock.calls[0][0].recipient).toBe('test@test.com');
            expect(onSend.mock.calls[0][0].from).toBe('"test from" <noreply@test.com>');
        });

        it('test emailEventsForResend query', async () => {
            const orderEmailEventsForResend = await adminClient.query(GetEmailEventsForResendDocument, {
                entityType: 'Order',
                entityId: 'T_1',
            });
            if (isGraphQlErrorResult(orderEmailEventsForResend)) {
                throw new Error('Error in query');
            }
            expect(orderEmailEventsForResend.emailEventsForResend.length).toBe(2);
            expect(orderEmailEventsForResend.emailEventsForResend[0].label).toStrictEqual([
                {
                    languageCode: 'en',
                    value: 'Resend order confirmation',
                },
            ]);
            expect(orderEmailEventsForResend.emailEventsForResend[0].description).toStrictEqual([
                {
                    value: 'Resend order confirmation. It can be send only for specific reasons',
                    languageCode: LanguageCode.en,
                },
            ]);
            if (!orderEmailEventsForResend.emailEventsForResend[0].operationDefinitions) {
                throw new Error('Operation definitions are not defined, but should be');
            }
            expect(orderEmailEventsForResend.emailEventsForResend[0].operationDefinitions.code).toBe(
                'test-order-confirmation',
            );
            expect(orderEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args.length).toBe(
                2,
            );
            expect(orderEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args[0].name).toBe(
                'testBoolean',
            );
            expect(orderEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args[0].type).toBe(
                'boolean',
            );
            expect(orderEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args[1].name).toBe(
                'testNumber',
            );
            expect(orderEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args[1].type).toBe(
                'int',
            );

            expect(orderEmailEventsForResend.emailEventsForResend[1].label).toStrictEqual([
                {
                    languageCode: LanguageCode.en,
                    value: 'Resend order confirmation without operation',
                },
            ]);
            expect(orderEmailEventsForResend.emailEventsForResend[1].description).toStrictEqual([
                {
                    languageCode: LanguageCode.en,
                    value: 'Resend order confirmation without args. It can be send only for specific reasons',
                },
            ]);
            expect(orderEmailEventsForResend.emailEventsForResend[1].operationDefinitions).toBe(null);

            const customerEmailEventsForResend = await adminClient.query(GetEmailEventsForResendDocument, {
                entityType: 'Customer',
                entityId: 'T_1',
            });
            if (isGraphQlErrorResult(customerEmailEventsForResend)) {
                throw new Error('Error in query');
            }
            expect(customerEmailEventsForResend.emailEventsForResend.length).toBe(1);
            expect(customerEmailEventsForResend.emailEventsForResend[0].label).toStrictEqual([
                {
                    languageCode: LanguageCode.en,
                    value: 'Resend customer test email',
                },
            ]);
            expect(customerEmailEventsForResend.emailEventsForResend[0].description).toStrictEqual([
                {
                    languageCode: LanguageCode.en,
                    value: 'Resend customer test email. It can be send only for specific reasons',
                },
            ]);
            if (!customerEmailEventsForResend.emailEventsForResend[0].operationDefinitions) {
                throw new Error('Operation definitions are not defined, but should be');
            }
            expect(customerEmailEventsForResend.emailEventsForResend[0].operationDefinitions.code).toBe(
                'test-customer',
            );
            expect(
                customerEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args.length,
            ).toBe(2);
            expect(
                customerEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args[0].name,
            ).toBe('testBoolean');
            expect(
                customerEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args[0].type,
            ).toBe('boolean');
            expect(
                customerEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args[1].name,
            ).toBe('testNumber');
            expect(
                customerEmailEventsForResend.emailEventsForResend[0].operationDefinitions.args[1].type,
            ).toBe('int');
        });

        it('test order test email event for resend', async () => {
            onSend.mockClear();
            const availableEvents = await adminClient.query(GetEmailEventsForResendDocument, {
                entityType: 'Order',
                entityId: 'T_1',
            });

            if (isGraphQlErrorResult(availableEvents)) {
                throw new Error('Error in query');
            }

            const orderEmailEventsForResend = availableEvents.emailEventsForResend;
            expect(orderEmailEventsForResend.length).toBe(2);
            const orderEvent = orderEmailEventsForResend[0];
            const orderEventType = orderEvent.type;
            const orderEventOperation = orderEvent.operationDefinitions;
            const orderEventArgs = orderEventOperation?.args as any[];
            const orderEventCode = orderEventOperation?.code as string;
            const orderEventEntity = orderEvent.entityType;
            const orderEntityId = 'T_1';
            const orderEventTestBoolean = JSON.stringify(true);
            const orderEventTestNumber = JSON.stringify(1);
            const orderEventResend = await adminClient.query(ResendEmailEventDocument, {
                input: {
                    type: orderEventType,
                    entityType: orderEventEntity,
                    entityId: orderEntityId,
                    operation: {
                        code: orderEventCode,
                        arguments: [
                            {
                                name: orderEventArgs[0].name,
                                value: orderEventTestBoolean,
                            },
                            {
                                name: orderEventArgs[1].name,
                                value: orderEventTestNumber,
                            },
                        ],
                    },
                },
            });

            if (isGraphQlErrorResult(orderEventResend)) {
                throw new Error('Error in mutation');
            }
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Order confirmation');
        });

        it('test customer test email event for resend', async () => {
            onSend.mockClear();
            const availableEvents = await adminClient.query(GetEmailEventsForResendDocument, {
                entityType: 'Customer',
                entityId: String(customerId),
            });

            if (isGraphQlErrorResult(availableEvents)) {
                throw new Error('Error in query');
            }

            const customerEmailEventsForResend = availableEvents.emailEventsForResend;
            expect(customerEmailEventsForResend.length).toBe(1);
            const customerEvent = customerEmailEventsForResend[0];
            const customerEventType = customerEvent.type;
            const customerEventOperation = customerEvent.operationDefinitions;
            const customerEventArgs = customerEventOperation?.args as any[];
            const customerEventCode = customerEventOperation?.code as string;
            const customerEventEntity = customerEvent.entityType;
            const customerEntityId = String(customerId);
            const customerEventTestBoolean = JSON.stringify(true);
            const customerEventTestNumber = JSON.stringify(2);
            const customerEventResend = await adminClient.query(ResendEmailEventDocument, {
                input: {
                    type: customerEventType,
                    entityType: customerEventEntity,
                    entityId: customerEntityId,
                    operation: {
                        code: customerEventCode,
                        arguments: [
                            {
                                name: customerEventArgs[0].name,
                                value: customerEventTestBoolean,
                            },
                            {
                                name: customerEventArgs[1].name,
                                value: customerEventTestNumber,
                            },
                        ],
                    },
                },
            });

            if (isGraphQlErrorResult(customerEventResend)) {
                throw new Error('Error in mutation');
            }
            expect(customerEventResend.resendEmailEvent).toBe(true);
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Test customer');
        });

        it('test emailEventsForResend query without operation', async () => {
            onSend.mockClear();
            const orderEmailEventsForResend = await adminClient.query(GetEmailEventsForResendDocument, {
                entityType: 'Order',
                entityId: 'T_1',
            });
            if (isGraphQlErrorResult(orderEmailEventsForResend)) {
                throw new Error('Error in query');
            }
            expect(orderEmailEventsForResend.emailEventsForResend.length).toBe(2);
            expect(orderEmailEventsForResend.emailEventsForResend[1].label).toStrictEqual([
                {
                    languageCode: LanguageCode.en,
                    value: 'Resend order confirmation without operation',
                },
            ]);
            expect(orderEmailEventsForResend.emailEventsForResend[1].description).toStrictEqual([
                {
                    value: 'Resend order confirmation without args. It can be send only for specific reasons',
                    languageCode: LanguageCode.en,
                },
            ]);
            expect(orderEmailEventsForResend.emailEventsForResend[1].operationDefinitions).toBe(null);

            const orderEvent = orderEmailEventsForResend.emailEventsForResend[1];
            const orderEventOperation = orderEvent.operationDefinitions;
            expect(orderEventOperation).toBe(null);
            const orderEventType = orderEvent.type;
            const orderEventEntity = orderEvent.entityType;
            const orderEntityId = 'T_1';
            const orderEventResend = await adminClient.query(ResendEmailEventDocument, {
                input: {
                    type: orderEventType,
                    entityType: orderEventEntity,
                    entityId: orderEntityId,
                },
            });

            if (isGraphQlErrorResult(orderEventResend)) {
                throw new Error('Error in mutation');
            }
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Order confirmation without operation');
        });
    });
});
