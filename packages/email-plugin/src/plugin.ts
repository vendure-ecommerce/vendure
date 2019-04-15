import { EventBus, InternalServerError, Type, VendurePlugin } from '@vendure/core';
import fs from 'fs-extra';

import { EmailSender } from './email-sender';
import { EmailEventHandler } from './event-listener';
import { HandlebarsMjmlGenerator } from './handlebars-mjml-generator';
import { TemplateLoader } from './template-loader';
import { EmailPluginDevModeOptions, EmailPluginOptions, EmailTransportOptions, EventWithContext } from './types';

/**
 * @description
 * The EmailPlugin creates and sends transactional emails based on Vendure events. It uses an [MJML](https://mjml.io/)-based
 * email generator to generate the email body and [Nodemailer](https://nodemailer.com/about/) to send the emais.
 *
 * ## Installation
 *
 * `yarn add @vendure/email-plugin`
 *
 * or
 *
 * `npm install @vendure/email-plugin`
 *
 * @example
 * ```ts
 * import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     new EmailPlugin({
 *       handlers: defaultEmailHandlers,
 *       templatePath: path.join(__dirname, 'vendure/email/templates'),
 *       transport: {
 *         type: 'smtp',
 *         host: 'smtp.example.com',
 *         port: 587,
 *         auth: {
 *           user: 'username',
 *           pass: 'password',
 *         }
 *       },
 *     }),
 *   ],
 * };
 * ```
 *
 * ## Email templates
 *
 * In the example above, the plugin has been configured to look in `<app-root>/vendure/email/templates`
 * for the email template files. If you used `@vendure/create` to create your application, the templates will have
 * been copied to that location during setup.
 *
 * If you are installing the EmailPlugin separately, then you'll need to copy the templates manually from
 * `node_modules/@vendure/email-plugin/templates` to a location of your choice, and then point the `templatePath` config
 * property at that directory.
 *
 * ## Customizing templates
 *
 * Emails are generated from templates which use [MJML](https://mjml.io/) syntax. MJML is an open-source HTML-like markup
 * language which makes the task of creating responsive email markup simple. By default, the templates are installed to
 * `<project root>/vendure/email/templates` and can be freely edited.
 *
 * Dynamic data such as the recipient's name or order items are specified using [Handlebars syntax](https://handlebarsjs.com/):
 *
 * ```HTML
 * <p>Dear {{ order.customer.firstName }} {{ order.customer.lastName }},</p>
 *
 * <p>Thank you for your order!</p>
 *
 * <mj-table cellpadding="6px">
 *   {{#each order.lines }}
 *     <tr class="order-row">
 *       <td>{{ quantity }} x {{ productVariant.name }}</td>
 *       <td>{{ productVariant.quantity }}</td>
 *       <td>{{ formatMoney totalPrice }}</td>
 *     </tr>
 *   {{/each}}
 * </mj-table>
 * ```
 *
 * ### Handlebars helpers
 *
 * The following helper functions are available for use in email templates:
 *
 * * `formatMoney`: Formats an amount of money (which are always stored as integers in Vendure) as a decimal, e.g. `123` => `1.23`
 * * `formatDate`: Formats a Date value with the [dateformat](https://www.npmjs.com/package/dateformat) package.
 *
 * ## Extending the default email handlers
 *
 * The `defaultEmailHandlers` array defines the default handlers such as for handling new account registration, order confirmation, password reset
 * etc. These defaults can be extended by adding custom templates for languages other than the default, or even completely new types of emails
 * which respond to any of the available [VendureEvents](/docs/typescript-api/events/). See the {@link EmailEventHandler} documentation for details on how to do so.
 *
 * ## Dev mode
 *
 * For development, the `transport` option can be replaced by `devMode: true`. Doing so configures Vendure to use the
 * [file transport]({{}}) and outputs emails as rendered HTML files in a directory named "test-emails" which is located adjacent to the directory
 * configured in the `templatePath`.
 *
 * ```ts
 * new EmailPlugin({
 *   templatePath: path.join(__dirname, 'vendure/email/templates'),
 *   devMode: true,
 * })
 * ```
 *
 * @docsCategory EmailPlugin
 */
export class EmailPlugin implements VendurePlugin {
    private readonly transport: EmailTransportOptions;
    private readonly options: EmailPluginOptions | EmailPluginDevModeOptions;
    private eventBus: EventBus;
    private templateLoader: TemplateLoader;
    private emailSender: EmailSender;
    private generator: HandlebarsMjmlGenerator;

    constructor(options: EmailPluginOptions | EmailPluginDevModeOptions) {
        this.options = options;
        if (isDevModeOptions(options)) {
            this.transport = {
                type: 'file',
                raw: false,
                outputPath: options.outputPath,
            };
        } else {
            if (!options.transport) {
                throw new InternalServerError(
                    `When devMode is not set to true, the 'transport' property must be set.`,
                );
            }
            this.transport = options.transport;
        }
    }

    async onBootstrap(inject: <T>(type: Type<T>) => T): Promise<void> {
        this.eventBus = inject(EventBus);
        this.templateLoader = new TemplateLoader(this.options.templatePath);
        this.emailSender = new EmailSender();
        this.generator = new HandlebarsMjmlGenerator();

        await this.setupEventSubscribers();
        if (this.generator.onInit) {
            await this.generator.onInit.call(this.generator, this.options);
        }
    }

    async setupEventSubscribers() {
        for (const handler of this.options.handlers) {
            this.eventBus.subscribe(handler.event, event => {
                return this.handleEvent(handler, event);
            });
        }
        if (this.transport.type === 'file') {
            // ensure the configured directory exists before
            // we attempt to write files to it
            const emailPath = this.transport.outputPath;
            await fs.ensureDir(emailPath);
        }
    }

    private async handleEvent(handler: EmailEventHandler, event: EventWithContext) {
        const { type } = handler;
        const result = handler.handle(event);
        if (!result) {
            return;
        }
        const bodySource = await this.templateLoader.loadTemplate(
            type,
            result.templateFile,
        );
        const generated = await this.generator.generate(
            result.subject,
            bodySource,
            result.templateVars,
        );
        const emailDetails = { ...generated, recipient: result.recipient };
        await this.emailSender.send(emailDetails, this.transport);
    }
}

function isDevModeOptions(
    input: EmailPluginOptions | EmailPluginDevModeOptions,
): input is EmailPluginDevModeOptions {
    return (input as EmailPluginDevModeOptions).devMode === true;
}
