import { InternalServerError, Logger } from '@vendure/core';
import fs from 'fs-extra';

import { isDevModeOptions } from './common';
import { loggerCtx } from './constants';
import { EmailSender } from './email-sender';
import { HandlebarsMjmlGenerator } from './handlebars-mjml-generator';
import { TemplateLoader } from './template-loader';
import { EmailPluginOptions, EmailTransportOptions, IntermediateEmailDetails } from './types';

/**
 * This class combines the template loading, generation, and email sending - the actual "work" of
 * the EmailPlugin. It is arranged this way primarily to accomodate easier testing, so that the
 * tests can be run without needing all the JobQueue stuff which would require a full e2e test.
 */
export class EmailProcessor {
    protected templateLoader: TemplateLoader;
    protected emailSender: EmailSender;
    protected generator: HandlebarsMjmlGenerator;
    protected transport: EmailTransportOptions;

    constructor(protected options: EmailPluginOptions) {}

    async init() {
        this.templateLoader = new TemplateLoader(this.options.templatePath);
        this.emailSender = new EmailSender();
        this.generator = new HandlebarsMjmlGenerator();
        if (this.generator.onInit) {
            await this.generator.onInit.call(this.generator, this.options);
        }
        if (isDevModeOptions(this.options)) {
            this.transport = {
                type: 'file',
                raw: false,
                outputPath: this.options.outputPath,
            };
        } else {
            if (!this.options.transport) {
                throw new InternalServerError(
                    `When devMode is not set to true, the 'transport' property must be set.`,
                );
            }
            this.transport = this.options.transport;
        }
        if (this.transport.type === 'file') {
            // ensure the configured directory exists before
            // we attempt to write files to it
            const emailPath = this.transport.outputPath;
            await fs.ensureDir(emailPath);
        }
    }

    async process(data: IntermediateEmailDetails) {
        try {
            const bodySource = await this.templateLoader.loadTemplate(data.type, data.templateFile);
            const generated = await this.generator.generate(
                data.from,
                data.subject,
                bodySource,
                data.templateVars,
            );
            const emailDetails = { ...generated, recipient: data.recipient };
            await this.emailSender.send(emailDetails, this.transport);
            return true;
        } catch (err: unknown) {
            if (err instanceof Error) {
                Logger.error(err.message, loggerCtx, err.stack);
            } else {
                Logger.error(String(err), loggerCtx);
            }
            return false;
        }
    }
}
