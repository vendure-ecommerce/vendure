import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { asyncObservable, InternalServerError } from '@vendure/core';
import fs from 'fs-extra';
import { Observable } from 'rxjs';

import { isDevModeOptions } from './common';
import { EMAIL_PLUGIN_OPTIONS } from './constants';
import { EmailSender } from './email-sender';
import { HandlebarsMjmlGenerator } from './handlebars-mjml-generator';
import { TemplateLoader } from './template-loader';
import { EmailPluginOptions, EmailTransportOptions, EmailWorkerMessage } from './types';

@Controller()
export class EmailWorkerController implements OnModuleInit {
    private templateLoader: TemplateLoader;
    private emailSender: EmailSender;
    private generator: HandlebarsMjmlGenerator;
    private transport: EmailTransportOptions;

    constructor(@Inject(EMAIL_PLUGIN_OPTIONS) private options: EmailPluginOptions) {}

    async onModuleInit() {
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

    @MessagePattern(EmailWorkerMessage.pattern)
    sendEmail(data: EmailWorkerMessage['data']): Observable<EmailWorkerMessage['response']> {
        return asyncObservable(async () => {
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
        });
    }
}
