import * as fs from 'fs-extra';
import * as opn from 'opn';
import * as path from 'path';
import { LanguageCode } from 'shared/generated-types';

import { RequestContext } from '../api/common/request-context';
import { NoopEmailGenerator } from '../config/email/noop-email-generator';
import { EmailOptions } from '../config/vendure-config';
import { Channel } from '../entity/channel/channel.entity';
import { Customer } from '../entity/customer/customer.entity';
import { OrderItem } from '../entity/order-item/order-item.entity';
import { OrderLine } from '../entity/order-line/order-line.entity';
import { Order } from '../entity/order/order.entity';
import { ProductVariant } from '../entity/product-variant/product-variant.entity';
import { OrderStateTransitionEvent } from '../event-bus/events/order-state-transition-event';

import { defaultEmailTypes } from './default-email-types';
import { EmailContext } from './email-context';
import { HandlebarsMjmlGenerator } from './handlebars-mjml-generator';
import { TemplateLoader } from './template-loader';
// tslint:disable:no-console

const generator = new HandlebarsMjmlGenerator(path.join(__dirname, 'templates', 'partials'));
const emailOptions: EmailOptions<any> = {
    emailTypes: defaultEmailTypes,
    generator: new NoopEmailGenerator(),
    transport: {
        type: 'none',
    },
};
const loader = new TemplateLoader({ emailOptions } as any);

const emailType = process.argv[2];
if (!emailType) {
    failWith(`Please specify an emailType as the first argument. Example: order-confirmation`);
}

// tslint:disable-next-line
generateEmail(emailType);

/**
 * Generates an .html file for the emailType specified as the first argument to the script.
 */
async function generateEmail(type: string) {
    let emailContext: EmailContext | undefined;
    switch (type) {
        case 'order-confirmation':
            emailContext = getOrderReceiptContext();
    }
    if (!emailContext) {
        failWith(`Could not create a context for type "${type}"`);
        return;
    }
    const { subject, body, templateContext } = await loader.loadTemplate(type, emailContext);
    const generatedEmailContext = await generator.generate(subject, body, templateContext);

    const previewDir = path.join(__dirname, 'preview');
    await fs.ensureDir(previewDir);
    await fs.writeFile(path.join(previewDir, `${type}.html`), generatedEmailContext.body);
    await opn(path.join(previewDir, `${type}.html`));
}

function getOrderReceiptContext(): EmailContext<'order-confirmation', OrderStateTransitionEvent> | undefined {
    const event = new OrderStateTransitionEvent(
        'ArrangingPayment',
        'PaymentSettled',
        createRequestContext(),
        new Order({
            id: '6',
            createdAt: '2018-10-31T15:18:29.261Z',
            updatedAt: '2018-10-31T15:24:17.000Z',
            code: 'T3EPGJKTVZPBD6Z9',
            state: 'ArrangingPayment',
            active: true,
            customer: new Customer({
                id: '3',
                firstName: 'Horacio',
                lastName: 'Franecki',
            }),
            lines: [
                new OrderLine({
                    id: '5',
                    featuredAsset: {
                        preview: 'http://localhost:3000/assets/mikkel-bech-748940-unsplash__49__preview.jpg',
                    },
                    productVariant: new ProductVariant({
                        id: '3',
                        name: 'en Intelligent Cotton Salad Small',
                        sku: '5x7ss',
                    }),
                    items: [
                        new OrderItem({
                            id: '6',
                            unitPrice: 745,
                            unitPriceIncludesTax: false,
                            taxRate: 20,
                            pendingAdjustments: [],
                        }),
                    ],
                }),
                new OrderLine({
                    id: '6',
                    featuredAsset: {
                        preview: 'http://localhost:3000/assets/mikkel-bech-748940-unsplash__49__preview.jpg',
                    },
                    productVariant: new ProductVariant({
                        id: '4',
                        name: 'en Intelligent Cotton Salad Large',
                        sku: '5x7ss',
                    }),
                    items: [
                        new OrderItem({
                            id: '7',
                            unitPrice: 745,
                            unitPriceIncludesTax: false,
                            taxRate: 20,
                            pendingAdjustments: [],
                        }),
                    ],
                }),
            ],
            subTotal: 1788,
            subTotalBeforeTax: 1490,
            shipping: 1000,
            shippingMethod: {
                code: 'express-flat-rate',
                description: 'Express Shipping',
                id: '2',
            },
            shippingAddress: {
                fullName: 'Horacio Franecki',
                company: '',
                streetLine1: '6000 Pagac Land',
                streetLine2: '',
                city: 'Port Kirsten',
                province: 'Avon',
                postalCode: 'ZU32 9CP',
                country: 'Cabo Verde',
                phoneNumber: '',
            },
            payments: [],
            pendingAdjustments: [],
        }),
    );

    const contextConfig = defaultEmailTypes['order-confirmation'].createContext(event);
    if (contextConfig) {
        return new EmailContext({
            ...contextConfig,
            type: 'order-confirmation',
            event,
        });
    }
}

function createRequestContext(): RequestContext {
    return new RequestContext({
        languageCode: LanguageCode.en,
        session: {} as any,
        isAuthorized: false,
        authorizedAsOwnerOnly: true,
        channel: new Channel(),
    });
}

function failWith(message: string) {
    console.error(message);
    process.exit(1);
}
