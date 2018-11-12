import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import { createTransport } from 'nodemailer';
import { default as Mail } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as path from 'path';
import { normalizeString } from 'shared/normalize-string';
import { assertNever } from 'shared/shared-utils';
import * as Stream from 'stream';

import { ConfigService } from '../config/config.service';
import { EmailTypeConfig, TemplateConfig } from '../config/email/email-options';
import { FileTransportOptions } from '../config/email/email-transport-options';
import { EventBus } from '../event-bus/event-bus';
import { VendureEvent } from '../event-bus/vendure-event';

import { EmailContext, GeneratedEmailContext } from './email-context';

export type StreamTransportInfo = {
    envelope: {
        from: string;
        to: string[];
    };
    messageId: string;
    message: Stream;
};

@Injectable()
export class TransactionalEmailService {
    constructor(private configService: ConfigService, private eventBus: EventBus) {}

    async init() {
        const { emailTypes } = this.configService.emailOptions;
        for (const [type, config] of Object.entries(emailTypes)) {
            this.eventBus.subscribe(config.triggerEvent, event => {
                return this.handleEvent(type, config, event);
            });
        }
        if (this.configService.emailOptions.transport.type === 'file') {
            // ensure the configured directory exists before
            // we attempt to write files to it
            const emailPath = this.configService.emailOptions.transport.outputPath;
            await fs.ensureDir(emailPath);
        }
    }

    private async handleEvent(type: string, config: EmailTypeConfig<any>, event: VendureEvent) {
        const { generator } = this.configService.emailOptions;
        const contextConfig = config.createContext(event);
        if (contextConfig) {
            const emailContext = new EmailContext({
                ...contextConfig,
                type,
                event,
            });
            const templateConfig = this.getTemplateConfig(type, emailContext);
            const templateContents = await this.loadTemplateContents(templateConfig.templatePath);
            const templateContext = templateConfig.templateContext(emailContext);
            const generatedEmailContext = await generator.generate(
                templateConfig.subject,
                templateContents,
                templateContext,
            );
            await this.send(generatedEmailContext);
        }
    }

    /**
     * Returns the corresponding TemplateConfig based on the channelCode and languageCode of the
     * EmailContext object.
     */
    private getTemplateConfig(type: string, context: EmailContext): TemplateConfig {
        const { emailTypes } = this.configService.emailOptions;
        const typeConfig = emailTypes[type].templates;
        const channelConfig = typeConfig[context.channelCode] || typeConfig.defaultChannel;
        const languageConfig = channelConfig[context.languageCode] || channelConfig.defaultLanguage;
        return languageConfig;
    }

    private loadTemplateContents(filePath: string): Promise<string> {
        return fs.readFile(filePath, 'utf-8');
    }

    private async send(email: GeneratedEmailContext) {
        const { transport } = this.configService.emailOptions;
        let transporter: Mail;
        switch (transport.type) {
            case 'none':
                return;
                break;
            case 'file':
                transporter = createTransport({
                    streamTransport: true,
                });
                const result = await this.sendMail(email, transporter);
                const fileName = normalizeString(
                    `${new Date().toISOString()} ${result.envelope.to[0]} ${email.subject}`,
                    '_',
                );
                const filePath = path.join(transport.outputPath, fileName);
                await this.writeToFile(filePath, result);
                break;
            case 'sendmail':
                transporter = createTransport({
                    sendmail: true,
                    path: transport.path,
                });
                await this.sendMail(email, transporter);
                break;
            case 'smtp':
                transporter = createTransport({
                    host: transport.host,
                    port: transport.port,
                    secure: transport.secure,
                    auth: transport.auth.user,
                } as SMTPTransport.Options);
                await this.sendMail(email, transporter);
                break;
            default:
                return assertNever(transport);
        }
    }

    private async sendMail(email: GeneratedEmailContext, transporter: Mail): Promise<any> {
        return transporter.sendMail({
            to: email.recipient,
            subject: email.subject,
            html: email.body,
        });
    }

    private async writeToFile(filePath: string, info: StreamTransportInfo): Promise<string> {
        const writeStream = fs.createWriteStream(filePath);
        return new Promise<string>((resolve, reject) => {
            writeStream.on('open', () => {
                info.message.pipe(writeStream);
                writeStream.on('close', resolve);
                writeStream.on('error', reject);
            });
        });
    }
}
