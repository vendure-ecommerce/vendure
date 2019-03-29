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
 * Configures the server to use the Handlebars / MJML email generator.
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
