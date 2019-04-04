import { EventBus, InternalServerError, Type, VendureConfig, VendureEvent, VendurePlugin } from '@vendure/core';
import fs from 'fs-extra';
import path from 'path';

import { DefaultEmailType, defaultEmailTypes } from './default-email-types';
import { EmailContext } from './email-context';
import { EmailSender } from './email-sender';
import { HandlebarsMjmlGenerator } from './handlebars-mjml-generator';
import { TemplateLoader } from './template-loader';
import { EmailOptions, EmailPluginDevModeOptions, EmailPluginOptions, EmailTransportOptions, EmailTypeConfig } from './types';

/**
 * @description
 * The EmailPlugin creates and sends transactional emails based on Vendure events. It uses an [MJML](https://mjml.io/)-based
 * email generator to generate the email body and [Nodemailer](https://nodemailer.com/about/) to send the emais.
 *
 * @example
 * ```ts
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     new EmailPlugin({
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
 * ## Dev mode
 *
 * For development, the `transport` option can be replaced by `devMode: true`. Doing so configures Vendure to use the
 * [file transport]({{}}) and outputs emails as rendered HTML files in a directory named "test-emails" which is located adjacent to the directory configured in the `templatePath`.
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
    private readonly templatePath: string;
    private readonly transport: EmailTransportOptions;
    private readonly templateVars: { [name: string]: any };
    private eventBus: EventBus;
    private templateLoader: TemplateLoader;
    private emailSender: EmailSender;
    private readonly emailOptions: EmailOptions<DefaultEmailType>;

    constructor(options: EmailPluginOptions | EmailPluginDevModeOptions) {
        this.templatePath = options.templatePath;
        this.templateVars = options.templateVars || {};
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
        this.emailOptions = {
            emailTemplatePath: this.templatePath,
            emailTypes: defaultEmailTypes,
            generator: new HandlebarsMjmlGenerator(),
            transport: this.transport,
            templateVars: this.templateVars,
        };
    }

    async onBootstrap(inject: <T>(type: Type<T>) => T): Promise<void> {
        this.eventBus = inject(EventBus);
        this.templateLoader = new TemplateLoader(this.emailOptions);
        this.emailSender = new EmailSender();

        await this.setupEventSubscribers();
        const { generator } = this.emailOptions;
        if (generator.onInit) {
            await generator.onInit.call(generator, this.emailOptions);
        }
    }

    async setupEventSubscribers() {
        const { emailTypes } = this.emailOptions;
        for (const [type, config] of Object.entries(emailTypes)) {
            this.eventBus.subscribe(config.triggerEvent, event => {
                return this.handleEvent(type, config, event);
            });
        }
        if (this.emailOptions.transport.type === 'file') {
            // ensure the configured directory exists before
            // we attempt to write files to it
            const emailPath = this.emailOptions.transport.outputPath;
            await fs.ensureDir(emailPath);
        }
    }

    private async handleEvent(type: string, config: EmailTypeConfig<any>, event: VendureEvent) {
        const { generator, transport, templateVars } = this.emailOptions;
        const contextConfig = config.createContext(event);
        if (contextConfig) {
            const emailContext = new EmailContext({
                ...contextConfig,
                type,
                event,
                templateVars: templateVars || {},
            });
            const { subject, body, templateContext } = await this.templateLoader.loadTemplate(
                type,
                emailContext,
            );
            const generatedEmailContext = await generator.generate(
                subject,
                body,
                templateContext,
                emailContext,
            );
            await this.emailSender.send(generatedEmailContext, transport);
        }
    }
}

function isDevModeOptions(
    input: EmailPluginOptions | EmailPluginDevModeOptions,
): input is EmailPluginDevModeOptions {
    return (input as EmailPluginDevModeOptions).devMode === true;
}
