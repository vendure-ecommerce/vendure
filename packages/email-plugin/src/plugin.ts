import {
    Inject,
    MiddlewareConsumer,
    NestModule,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
    EventBus,
    Injector,
    JobQueue,
    JobQueueService,
    Logger,
    PluginCommonModule,
    ProcessContext,
    registerPluginStartupMessage,
    Type,
    VendurePlugin,
} from '@vendure/core';

import { isDevModeOptions } from './common';
import { EMAIL_PLUGIN_OPTIONS, loggerCtx } from './constants';
import { DevMailbox } from './dev-mailbox';
import { EmailProcessor } from './email-processor';
import { EmailEventHandler, EmailEventHandlerWithAsyncData } from './event-handler';
import {
    EmailPluginDevModeOptions,
    EmailPluginOptions,
    EventWithContext,
    IntermediateEmailDetails,
} from './types';

/**
 * @description
 * The EmailPlugin creates and sends transactional emails based on Vendure events. By default, it uses an [MJML](https://mjml.io/)-based
 * email generator to generate the email body and [Nodemailer](https://nodemailer.com/about/) to send the emails.
 *
 * ## High-level description
 * Vendure has an internal events system (see {@link EventBus}) that allows plugins to subscribe to events. The EmailPlugin is configured with
 * {@link EmailEventHandler}s that listen for a specific event and when it is published, the handler defines which template to use to generate
 * the resulting email.
 *
 * The plugin comes with a set of default handlers for the following events:
 * - Order confirmation
 * - New customer email address verification
 * - Password reset request
 * - Email address change request
 *
 * You can also create your own handlers and register them with the plugin - see the {@link EmailEventHandler} docs for more details.
 *
 * ## Installation
 *
 * `yarn add \@vendure/email-plugin`
 *
 * or
 *
 * `npm install \@vendure/email-plugin`
 *
 * @example
 * ```ts
 * import { defaultEmailHandlers, EmailPlugin } from '\@vendure/email-plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     EmailPlugin.init({
 *       handlers: defaultEmailHandlers,
 *       templatePath: path.join(__dirname, 'static/email/templates'),
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
 * In the example above, the plugin has been configured to look in `<app-root>/static/email/templates`
 * for the email template files. If you used `\@vendure/create` to create your application, the templates will have
 * been copied to that location during setup.
 *
 * If you are installing the EmailPlugin separately, then you'll need to copy the templates manually from
 * `node_modules/\@vendure/email-plugin/templates` to a location of your choice, and then point the `templatePath` config
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
 * which respond to any of the available [VendureEvents](/docs/typescript-api/events/).
 *
 * A good way to learn how to create your own email handlers is to take a look at the
 * [source code of the default handlers](https://github.com/vendure-ecommerce/vendure/blob/master/packages/email-plugin/src/default-email-handlers.ts).
 * New handlers are defined in exactly the same way.
 *
 * It is also possible to modify the default handlers:
 *
 * ```TypeScript
 * // Rather than importing `defaultEmailHandlers`, you can
 * // import the handlers individually
 * import {
 *   orderConfirmationHandler,
 *   emailVerificationHandler,
 *   passwordResetHandler,
 *   emailAddressChangeHandler,
 * } from '\@vendure/email-plugin';
 * import { CustomerService } from '\@vendure/core';
 *
 * // This allows you to then customize each handler to your needs.
 * // For example, let's set a new subject line to the order confirmation:
 * orderConfirmationHandler
 *   .setSubject(`We received your order!`);
 *
 * // Another example: loading additional data and setting new
 * // template variables.
 * passwordResetHandler
 *   .loadData(async ({ event, injector }) => {
 *     const customerService = injector.get(CustomerService);
 *     const customer = await customerService.findOneByUserId(event.ctx, event.user.id);
 *     return { customer };
 *   })
 *   .setTemplateVars(event => ({
 *     passwordResetToken: event.user.getNativeAuthenticationMethod().passwordResetToken,
 *     customer: event.data.customer,
 *   }));
 *
 * // Then you pass the handlers to the EmailPlugin init method
 * // individually
 * EmailPlugin.init({
 *   handlers: [
 *     orderConfirmationHandler,
 *     emailVerificationHandler,
 *     passwordResetHandler,
 *     emailAddressChangeHandler,
 *   ],
 *   // ...
 * }),
 * ```
 *
 * For all available methods of extending a handler, see the {@link EmailEventHandler} documentation.
 *
 * ## Dev mode
 *
 * For development, the `transport` option can be replaced by `devMode: true`. Doing so configures Vendure to use the
 * file transport (See {@link FileTransportOptions}) and outputs emails as rendered HTML files in the directory specified by the
 * `outputPath` property.
 *
 * ```TypeScript
 * EmailPlugin.init({
 *   devMode: true,
 *   route: 'mailbox',
 *   handlers: defaultEmailHandlers,
 *   templatePath: path.join(__dirname, 'vendure/email/templates'),
 *   outputPath: path.join(__dirname, 'test-emails'),
 * })
 * ```
 *
 * ### Dev mailbox
 *
 * In dev mode, a webmail-like interface available at the `/mailbox` path, e.g.
 * http://localhost:3000/mailbox. This is a simple way to view the output of all emails generated by the EmailPlugin while in dev mode.
 *
 * ## Troubleshooting SMTP Connections
 *
 * If you are having trouble sending email over and SMTP connection, set the `logging` and `debug` options to `true`. This will
 * send detailed information from the SMTP transporter to the configured logger (defaults to console). For maximum detail combine
 * this with a detail log level in the configured VendureLogger:
 *
 * ```TypeScript
 * const config: VendureConfig = {
 *   logger: new DefaultLogger({ level: LogLevel.Debug })
 *   // ...
 *   plugins: [
 *     EmailPlugin.init({
 *       // ...
 *       transport: {
 *         type: 'smtp',
 *         host: 'smtp.example.com',
 *         port: 587,
 *         auth: {
 *           user: 'username',
 *           pass: 'password',
 *         },
 *         logging: true,
 *         debug: true,
 *       },
 *     }),
 *   ],
 * };
 * ```
 *
 * @docsCategory EmailPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: EMAIL_PLUGIN_OPTIONS, useFactory: () => EmailPlugin.options }, EmailProcessor],
    compatibility: '^2.0.0-beta.0',
})
export class EmailPlugin implements OnApplicationBootstrap, OnApplicationShutdown, NestModule {
    private static options: EmailPluginOptions | EmailPluginDevModeOptions;
    private devMailbox: DevMailbox | undefined;
    private jobQueue: JobQueue<IntermediateEmailDetails> | undefined;
    private testingProcessor: EmailProcessor | undefined;

    /** @internal */
    constructor(
        private eventBus: EventBus,
        private moduleRef: ModuleRef,
        private emailProcessor: EmailProcessor,
        private jobQueueService: JobQueueService,
        private processContext: ProcessContext,
        @Inject(EMAIL_PLUGIN_OPTIONS) private options: EmailPluginOptions,
    ) {}

    /**
     * Set the plugin options.
     */
    static init(options: EmailPluginOptions | EmailPluginDevModeOptions): Type<EmailPlugin> {
        this.options = options;
        return EmailPlugin;
    }

    /** @internal */
    async onApplicationBootstrap(): Promise<void> {
        await this.initInjectableStrategies();
        await this.setupEventSubscribers();
        if (!isDevModeOptions(this.options) && this.options.transport.type === 'testing') {
            // When running tests, we don't want to go through the JobQueue system,
            // so we just call the email sending logic directly.
            this.testingProcessor = new EmailProcessor(this.options);
            await this.testingProcessor.init();
        } else {
            await this.emailProcessor.init();
            this.jobQueue = await this.jobQueueService.createQueue({
                name: 'send-email',
                process: job => {
                    return this.emailProcessor.process(job.data);
                },
            });
        }
    }

    async onApplicationShutdown() {
        await this.destroyInjectableStrategies();
    }

    configure(consumer: MiddlewareConsumer) {
        if (isDevModeOptions(this.options) && this.processContext.isServer) {
            Logger.info('Creating dev mailbox middleware', loggerCtx);
            this.devMailbox = new DevMailbox();
            consumer.apply(this.devMailbox.serve(this.options)).forRoutes(this.options.route);
            this.devMailbox.handleMockEvent((handler, event) => this.handleEvent(handler, event));
            registerPluginStartupMessage('Dev mailbox', this.options.route);
        }
    }

    private async initInjectableStrategies() {
        const injector = new Injector(this.moduleRef);
        if (typeof this.options.emailGenerator?.init === 'function') {
            await this.options.emailGenerator.init(injector);
        }
        if (typeof this.options.emailSender?.init === 'function') {
            await this.options.emailSender.init(injector);
        }
    }

    private async destroyInjectableStrategies() {
        if (typeof this.options.emailGenerator?.destroy === 'function') {
            await this.options.emailGenerator.destroy();
        }
        if (typeof this.options.emailSender?.destroy === 'function') {
            await this.options.emailSender.destroy();
        }
    }

    private async setupEventSubscribers() {
        for (const handler of EmailPlugin.options.handlers) {
            this.eventBus.ofType(handler.event).subscribe(event => {
                return this.handleEvent(handler, event);
            });
        }
    }

    private async handleEvent(
        handler: EmailEventHandler | EmailEventHandlerWithAsyncData<any>,
        event: EventWithContext,
    ) {
        Logger.debug(`Handling event "${handler.type}"`, loggerCtx);
        const { type } = handler;
        try {
            const injector = new Injector(this.moduleRef);
            const result = await handler.handle(
                event as any,
                EmailPlugin.options.globalTemplateVars,
                injector,
            );
            if (!result) {
                return;
            }
            if (this.jobQueue) {
                await this.jobQueue.add(result, { retries: 5 });
            } else if (this.testingProcessor) {
                await this.testingProcessor.process(result);
            }
        } catch (e: any) {
            Logger.error(e.message, loggerCtx, e.stack);
        }
    }
}
