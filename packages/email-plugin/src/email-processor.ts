import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Ctx, Injector, InternalServerError, Logger, RequestContext } from '@vendure/core';
import fs from 'fs-extra';

import { deserializeAttachments } from './attachment-utils';
import { isDevModeOptions, resolveTransportSettings } from './common';
import { EMAIL_PLUGIN_OPTIONS, loggerCtx } from './constants';
import { EmailGenerator } from './email-generator';
import { EmailSender } from './email-sender';
import { HandlebarsMjmlGenerator } from './handlebars-mjml-generator';
import { NodemailerEmailSender } from './nodemailer-email-sender';
import { FileBasedTemplateLoader } from './template-loader';
import {
    EmailDetails,
    EmailPluginOptions,
    EmailTransportOptions,
    InitializedEmailPluginOptions,
    IntermediateEmailDetails,
    TemplateLoader,
} from './types';

/**
 * This class combines the template loading, generation, and email sending - the actual "work" of
 * the EmailPlugin. It is arranged this way primarily to accommodate easier testing, so that the
 * tests can be run without needing all the JobQueue stuff which would require a full e2e test.
 */
@Injectable()
export class EmailProcessor {
    protected emailSender: EmailSender;
    protected generator: EmailGenerator;

    constructor(
        @Inject(EMAIL_PLUGIN_OPTIONS) protected options: InitializedEmailPluginOptions,
        private moduleRef: ModuleRef,
    ) {}

    async init() {
        this.emailSender = this.options.emailSender ? this.options.emailSender : new NodemailerEmailSender();
        this.generator = this.options.emailGenerator
            ? this.options.emailGenerator
            : new HandlebarsMjmlGenerator();
        if (this.generator.onInit) {
            await this.generator.onInit.call(this.generator, this.options);
        }
        const transport = await this.getTransportSettings();
        if (transport.type === 'file') {
            // ensure the configured directory exists before
            // we attempt to write files to it
            const emailPath = transport.outputPath;
            await fs.ensureDir(emailPath);
        }
    }

    async process(data: IntermediateEmailDetails) {
        try {
            const ctx = RequestContext.deserialize(data.ctx);
            const bodySource = await this.options.templateLoader.loadTemplate(
                new Injector(this.moduleRef),
                ctx,
                {
                    templateName: data.templateFile,
                    type: data.type,
                },
            );
            const generated = this.generator.generate(data.from, data.subject, bodySource, data.templateVars);
            const emailDetails: EmailDetails = {
                ...generated,
                recipient: data.recipient,
                attachments: deserializeAttachments(data.attachments),
                cc: data.cc,
                bcc: data.bcc,
                replyTo: data.replyTo,
            };
            const transportSettings = await this.getTransportSettings(ctx);
            await this.emailSender.send(emailDetails, transportSettings);
            return true;
        } catch (err: unknown) {
            if (err instanceof Error) {
                Logger.error(err.message, loggerCtx, err.stack);
            } else {
                Logger.error(String(err), loggerCtx);
            }
            throw err;
        }
    }

    async getTransportSettings(ctx?: RequestContext): Promise<EmailTransportOptions> {
        const transport = await resolveTransportSettings(this.options, new Injector(this.moduleRef), ctx);
        if (isDevModeOptions(this.options)) {
            if (transport && transport.type !== 'file') {
                Logger.warn(
                    `The EmailPlugin is running in dev mode. The configured '${transport.type}' transport will be replaced by the 'file' transport.`,
                    loggerCtx,
                );
            }
            return {
                type: 'file',
                raw: false,
                outputPath: this.options.outputPath,
            };
        } else {
            return transport;
        }
    }
}
