/* tslint:disable:no-non-null-assertion */
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import {
    EventBus,
    LanguageCode,
    Order,
    OrderStateTransitionEvent,
    PluginCommonModule,
    RequestContext,
    VendureEvent,
} from '@vendure/core';
import path from 'path';

import { orderConfirmationHandler } from './default-email-handlers';
import { EmailEventHandler } from './event-handler';
import { EmailEventListener } from './event-listener';
import { EmailPlugin } from './plugin';
import { EmailPluginOptions } from './types';

describe('EmailPlugin', () => {
    let plugin: EmailPlugin;
    let eventBus: EventBus;
    let onSend: jest.Mock;
    let module: TestingModule;

    async function initPluginWithHandlers(
        handlers: Array<EmailEventHandler<string, any>>,
        options?: Partial<EmailPluginOptions>,
    ) {
        onSend = jest.fn();
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqljs',
                    retryAttempts: 0,
                }),
                PluginCommonModule,
                EmailPlugin.init({
                    templatePath: path.join(__dirname, '../test-templates'),
                    transport: {
                        type: 'testing',
                        onSend,
                    },
                    handlers,
                    ...options,
                }),
            ],
            providers: [MockService],
        }).compile();

        plugin = module.get(EmailPlugin);
        eventBus = module.get(EventBus);
        await plugin.onVendureBootstrap();
        return module;
    }

    afterEach(async () => {
        if (module) {
            await module.close();
        }
    });

    it('setting from, recipient, subject', async () => {
        const ctx = RequestContext.fromObject({
            _channel: { code: DEFAULT_CHANNEL_CODE },
            _languageCode: LanguageCode.en,
        });
        const handler = new EmailEventListener('test')
            .on(MockEvent)
            .setFrom('"test from" <noreply@test.com>')
            .setRecipient(() => 'test@test.com')
            .setSubject('Hello')
            .setTemplateVars(event => ({ subjectVar: 'foo' }));

        await initPluginWithHandlers([handler]);

        eventBus.publish(new MockEvent(ctx, true));
        await pause();
        expect(onSend.mock.calls[0][0].subject).toBe('Hello');
        expect(onSend.mock.calls[0][0].recipient).toBe('test@test.com');
        expect(onSend.mock.calls[0][0].from).toBe('"test from" <noreply@test.com>');
    });

    describe('event filtering', () => {
        const ctx = RequestContext.fromObject({
            _channel: { code: DEFAULT_CHANNEL_CODE },
            _languageCode: LanguageCode.en,
        });

        it('single filter', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .filter(event => event.shouldSend === true)
                .setRecipient(() => 'test@test.com')
                .setFrom('"test from" <noreply@test.com>')
                .setSubject('test subject');

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, false));
            await pause();
            expect(onSend).not.toHaveBeenCalled();

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend).toHaveBeenCalledTimes(1);
        });

        it('multiple filters', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .filter(event => event.shouldSend === true)
                .filter(event => !!event.ctx.activeUserId)
                .setFrom('"test from" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('test subject');

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend).not.toHaveBeenCalled();

            const ctxWithUser = RequestContext.fromObject({ ...ctx, _session: { user: { id: 42 } } });

            eventBus.publish(new MockEvent(ctxWithUser, true));
            await pause();
            expect(onSend).toHaveBeenCalledTimes(1);
        });

        it('with .loadData() after .filter()', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .filter(event => event.shouldSend === true)
                .loadData(context => Promise.resolve('loaded data'))
                .setRecipient(() => 'test@test.com')
                .setFrom('"test from" <noreply@test.com>')
                .setSubject('test subject');

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, false));
            await pause();
            expect(onSend).not.toHaveBeenCalled();

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend).toHaveBeenCalledTimes(1);
        });
    });

    describe('templateVars', () => {
        const ctx = RequestContext.fromObject({
            _channel: { code: DEFAULT_CHANNEL_CODE },
            _languageCode: LanguageCode.en,
        });

        it('interpolates subject', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello {{ subjectVar }}')
                .setTemplateVars(event => ({ subjectVar: 'foo' }));

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Hello foo');
        });

        it('interpolates body', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello')
                .setTemplateVars(event => ({ testVar: 'this is the test var' }));

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].body).toContain('this is the test var');
        });

        /**
         * Intended to test the ability for Handlebars to interpolate
         * getters on the Order entity prototype.
         * See https://github.com/vendure-ecommerce/vendure/issues/259
         */
        it('interpolates body with property from entity', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello')
                .setTemplateVars(event => ({ order: new Order({ subTotal: 123 }) }));

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].body).toContain('Total: 123');
        });

        it('interpolates globalTemplateVars', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello {{ globalVar }}');

            await initPluginWithHandlers([handler], {
                globalTemplateVars: { globalVar: 'baz' },
            });

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Hello baz');
        });

        it('interpolates from', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setFrom('"test from {{ globalVar }}" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello');

            await initPluginWithHandlers([handler], {
                globalTemplateVars: { globalVar: 'baz' },
            });

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].from).toBe('"test from baz" <noreply@test.com>');
        });

        it('globalTemplateVars available in setTemplateVars method', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello {{ testVar }}')
                .setTemplateVars((event, globals) => ({ testVar: globals.globalVar + ' quux' }));

            await initPluginWithHandlers([handler], {
                globalTemplateVars: { globalVar: 'baz' },
            });

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Hello baz quux');
        });

        it('setTemplateVars overrides globals', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello {{ name }}')
                .setTemplateVars((event, globals) => ({ name: 'quux' }));

            await initPluginWithHandlers([handler], { globalTemplateVars: { name: 'baz' } });

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Hello quux');
        });
    });

    describe('handlebars helpers', () => {
        const ctx = RequestContext.fromObject({
            _channel: { code: DEFAULT_CHANNEL_CODE },
            _languageCode: LanguageCode.en,
        });

        it('formateDate', async () => {
            const handler = new EmailEventListener('test-helpers')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello')
                .setTemplateVars(event => ({ myDate: new Date('2020-01-01T10:00:00.000Z'), myPrice: 0 }));

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].body).toContain('Date: Wed Jan 01 2020 10:00:00');
        });

        it('formateMoney', async () => {
            const handler = new EmailEventListener('test-helpers')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello')
                .setTemplateVars(event => ({ myDate: new Date(), myPrice: 123 }));

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].body).toContain('Price: 1.23');
        });
    });

    describe('multiple configs', () => {
        const ctx = RequestContext.fromObject({
            _channel: { code: DEFAULT_CHANNEL_CODE },
            _languageCode: LanguageCode.en,
        });

        it('additional LanguageCode', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setSubject('Hello, {{ name }}!')
                .setRecipient(() => 'test@test.com')
                .setTemplateVars(() => ({ name: 'Test' }))
                .addTemplate({
                    channelCode: 'default',
                    languageCode: LanguageCode.de,
                    templateFile: 'body.de.hbs',
                    subject: 'Servus, {{ name }}!',
                });

            await initPluginWithHandlers([handler]);

            const ctxTa = RequestContext.fromObject({ ...ctx, _languageCode: LanguageCode.ta });
            eventBus.publish(new MockEvent(ctxTa, true));
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Hello, Test!');
            expect(onSend.mock.calls[0][0].body).toContain('Default body.');

            const ctxDe = RequestContext.fromObject({ ...ctx, _languageCode: LanguageCode.de });
            eventBus.publish(new MockEvent(ctxDe, true));
            await pause();
            expect(onSend.mock.calls[1][0].subject).toBe('Servus, Test!');
            expect(onSend.mock.calls[1][0].body).toContain('German body.');
        });
    });

    describe('loadData', () => {
        it('loads async data', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .loadData(async ({ inject }) => {
                    const service = inject(MockService);
                    return service.someAsyncMethod();
                })
                .setFrom('"test from" <noreply@test.com>')
                .setSubject('Hello, {{ testData }}!')
                .setRecipient(() => 'test@test.com')
                .setTemplateVars(event => ({ testData: event.data }));

            await initPluginWithHandlers([handler]);

            eventBus.publish(
                new MockEvent(
                    RequestContext.fromObject({
                        _channel: { code: DEFAULT_CHANNEL_CODE },
                        _languageCode: LanguageCode.en,
                    }),
                    true,
                ),
            );
            await pause();

            expect(onSend.mock.calls[0][0].subject).toBe('Hello, loaded data!');
        });

        it('works when loadData is called after other setup', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setFrom('"test from" <noreply@test.com>')
                .setSubject('Hello, {{ testData }}!')
                .setRecipient(() => 'test@test.com')
                .loadData(async ({ inject }) => {
                    const service = inject(MockService);
                    return service.someAsyncMethod();
                })
                .setTemplateVars(event => ({ testData: event.data }));

            await initPluginWithHandlers([handler]);

            eventBus.publish(
                new MockEvent(
                    RequestContext.fromObject({
                        _channel: { code: DEFAULT_CHANNEL_CODE },
                        _languageCode: LanguageCode.en,
                    }),
                    true,
                ),
            );
            await pause();

            expect(onSend.mock.calls[0][0].subject).toBe('Hello, loaded data!');
            expect(onSend.mock.calls[0][0].from).toBe('"test from" <noreply@test.com>');
            expect(onSend.mock.calls[0][0].recipient).toBe('test@test.com');
        });
    });

    describe('orderConfirmationHandler', () => {
        beforeEach(async () => {
            module = await initPluginWithHandlers([orderConfirmationHandler], {
                templatePath: path.join(__dirname, '../templates'),
            });
        });

        const ctx = RequestContext.fromObject({
            _channel: { code: DEFAULT_CHANNEL_CODE },
            _languageCode: LanguageCode.en,
        });

        const order = ({
            code: 'ABCDE',
            customer: {
                emailAddress: 'test@test.com',
            },
        } as Partial<Order>) as any;

        it('filters events with wrong order state', async () => {
            eventBus.publish(new OrderStateTransitionEvent('AddingItems', 'ArrangingPayment', ctx, order));
            await pause();
            expect(onSend).not.toHaveBeenCalled();

            eventBus.publish(new OrderStateTransitionEvent('AddingItems', 'Cancelled', ctx, order));
            await pause();
            expect(onSend).not.toHaveBeenCalled();

            eventBus.publish(new OrderStateTransitionEvent('AddingItems', 'PaymentAuthorized', ctx, order));
            await pause();
            expect(onSend).not.toHaveBeenCalled();

            eventBus.publish(new OrderStateTransitionEvent('ArrangingPayment', 'PaymentSettled', ctx, order));
            await pause();
            expect(onSend).toHaveBeenCalledTimes(1);
        });

        it('sets the Order Customer emailAddress as recipient', async () => {
            eventBus.publish(new OrderStateTransitionEvent('ArrangingPayment', 'PaymentSettled', ctx, order));
            await pause();

            expect(onSend.mock.calls[0][0].recipient).toBe(order.customer!.emailAddress);
        });

        it('sets the subject', async () => {
            eventBus.publish(new OrderStateTransitionEvent('ArrangingPayment', 'PaymentSettled', ctx, order));
            await pause();

            expect(onSend.mock.calls[0][0].subject).toBe(`Order confirmation for #${order.code}`);
        });
    });
});

const pause = () => new Promise(resolve => setTimeout(resolve, 100));

class MockEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public shouldSend: boolean) {
        super();
    }
}

class MockService {
    someAsyncMethod() {
        return Promise.resolve('loaded data');
    }
}
