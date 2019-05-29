/* tslint:disable:no-non-null-assertion */
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { EventBus, Order, OrderStateTransitionEvent, VendureEvent } from '@vendure/core';
import path from 'path';

import { orderConfirmationHandler } from './default-email-handlers';
import { EmailEventHandler, EmailEventListener } from './event-listener';
import { EmailPlugin } from './plugin';
import { EmailPluginOptions } from './types';

describe('EmailPlugin', () => {
    let plugin: EmailPlugin;
    let eventBus: EventBus;
    let onSend: jest.Mock;

    async function initPluginWithHandlers(handlers: Array<EmailEventHandler<string, any>>, options?: Partial<EmailPluginOptions>) {
        eventBus = new EventBus();
        onSend = jest.fn();
        plugin = new EmailPlugin({
            templatePath: path.join(__dirname, '../test-templates'),
            transport: {
                type: 'testing',
                onSend,
            },
            handlers,
            ...options,
        });

        const inject = (token: any): any => {
            if (token === EventBus) {
                return eventBus;
            } else {
                throw new Error(`Was not expecting to inject the token ${token}`);
            }
        };

        await plugin.onBootstrap(inject);
    }

    describe('event filtering', () => {

        const ctx = {
            channel: { code: DEFAULT_CHANNEL_CODE },
            languageCode: LanguageCode.en,
        } as any;

        it('single filter', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .filter(event => event.shouldSend === true)
                .setRecipient(() => 'test@test.com')
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
                .filter(event => !!event.ctx.user)
                .setRecipient(() => 'test@test.com')
                .setSubject('test subject');

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend).not.toHaveBeenCalled();

            eventBus.publish(new MockEvent({ ...ctx, user: 'joe' }, true));
            await pause();
            expect(onSend).toHaveBeenCalledTimes(1);
        });
    });

    describe('templateVars', () => {
        const ctx = {
            channel: { code: DEFAULT_CHANNEL_CODE },
            languageCode: LanguageCode.en,
        } as any;

        it('interpolates subject', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
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
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello')
                .setTemplateVars(event => ({ testVar: 'this is the test var' }));

            await initPluginWithHandlers([handler]);

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].body).toContain('this is the test var');
        });

        it('interpolates globalTemplateVars', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello {{ globalVar }}');

            await initPluginWithHandlers([handler], { globalTemplateVars: { globalVar: 'baz' } });

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Hello baz');
        });

        it('globalTemplateVars available in setTemplateVars method', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello {{ testVar }}')
                .setTemplateVars((event, globals) => ({ testVar: globals.globalVar + ' quux' }));

            await initPluginWithHandlers([handler], { globalTemplateVars: { globalVar: 'baz' } });

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Hello baz quux');
        });

        it('setTemplateVars overrides globals', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
                .setRecipient(() => 'test@test.com')
                .setSubject('Hello {{ name }}')
                .setTemplateVars((event, globals) => ({ name: 'quux' }));

            await initPluginWithHandlers([handler], { globalTemplateVars: { name: 'baz' } });

            eventBus.publish(new MockEvent(ctx, true));
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Hello quux');
        });
    });

    describe('multiple configs', () => {
        const ctx = {
            channel: { code: DEFAULT_CHANNEL_CODE },
            languageCode: LanguageCode.en,
        } as any;

        it('additional LanguageCode', async () => {
            const handler = new EmailEventListener('test')
                .on(MockEvent)
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

            eventBus.publish(new MockEvent({ ...ctx, languageCode: LanguageCode.ta }, true));
            await pause();
            expect(onSend.mock.calls[0][0].subject).toBe('Hello, Test!');
            expect(onSend.mock.calls[0][0].body).toContain('Default body.');

            eventBus.publish(new MockEvent({ ...ctx, languageCode: LanguageCode.de }, true));
            await pause();
            expect(onSend.mock.calls[1][0].subject).toBe('Servus, Test!');
            expect(onSend.mock.calls[1][0].body).toContain('German body.');
        });
    });

    describe('orderConfirmationHandler', () => {

        beforeEach(async () => {
            await initPluginWithHandlers([orderConfirmationHandler], { templatePath: path.join(__dirname, '../templates') });
        });

        const ctx = {
            channel: { code: DEFAULT_CHANNEL_CODE },
            languageCode: LanguageCode.en,
        } as any;

        const order = {
            code: 'ABCDE',
            customer: {
                emailAddress: 'test@test.com',
            },
        } as Partial<Order> as any;

        it('filters events with wrong order state', async () => {
            eventBus.publish(new OrderStateTransitionEvent('AddingItems', 'ArrangingPayment', ctx, order));
            await pause();
            expect(onSend).not.toHaveBeenCalled();

            eventBus.publish(new OrderStateTransitionEvent('AddingItems', 'Cancelled', ctx, order));
            await pause();
            expect(onSend).not.toHaveBeenCalled();

            eventBus.publish(new OrderStateTransitionEvent('AddingItems', 'OrderComplete', ctx, order));
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

const pause = () => new Promise(resolve => setTimeout(resolve, 50));

class MockEvent extends VendureEvent {
    constructor(public ctx: any, public shouldSend: boolean) {
        super();
    }
}
