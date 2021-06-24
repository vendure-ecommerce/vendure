import { Inject, Injectable } from '@nestjs/common';
import { InternalServerError, Logger } from '@vendure/core';
import fs from 'fs-extra';

import { deserializeAttachments } from './attachment-utils';
import { isDevModeOptions } from './common';
import { EMAIL_PLUGIN_OPTIONS, loggerCtx } from './constants';
import { HandlebarsMjmlGenerator } from './handlebars-mjml-generator';
import { NodemailerEmailSender } from './nodemailer-email-sender';
import { TemplateLoader } from './template-loader';
import {
    EmailDetails,
    EmailGenerator,
    EmailPluginOptions,
    EmailSender,
    EmailTransportOptions,
    IntermediateEmailDetails,
} from './types';

/**
 * This class combines the template loading, generation, and email sending - the actual "work" of
 * the EmailPlugin. It is arranged this way primarily to accommodate easier testing, so that the
 * tests can be run without needing all the JobQueue stuff which would require a full e2e test.
 */
@Injectable()
export class EmailProcessor {
    protected templateLoader: TemplateLoader;
    protected emailSender: EmailSender;
    protected generator: EmailGenerator;
    protected transport: EmailTransportOptions;

    constructor(@Inject(EMAIL_PLUGIN_OPTIONS) protected options: EmailPluginOptions) {}

    async init() {
        this.templateLoader = new TemplateLoader(this.options.templatePath);
        this.emailSender = this.options.emailSender ? this.options.emailSender : new NodemailerEmailSender();
        this.generator = this.options.emailGenerator
            ? this.options.emailGenerator
            : new HandlebarsMjmlGenerator();
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
            const emailDetails: EmailDetails = {
                ...generated,
                recipient: data.recipient,
                attachments: deserializeAttachments(data.attachments),
                cc: data.cc,
                bcc: data.bcc,
                replyTo: data.replyTo,
            };
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
