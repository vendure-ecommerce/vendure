import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import { createTransport } from 'nodemailer';
import { default as Mail } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as path from 'path';
import { normalizeString } from 'shared/normalize-string';
import { assertNever } from 'shared/shared-utils';
import { Stream } from 'stream';

import { EmailTransportOptions } from '../config/email/email-transport-options';

import { GeneratedEmailContext } from './email-context';

export type StreamTransportInfo = {
    envelope: {
        from: string;
        to: string[];
    };
    messageId: string;
    message: Stream;
};

@Injectable()
export class EmailSender {
    async send(email: GeneratedEmailContext, options: EmailTransportOptions) {
        let transporter: Mail;
        switch (options.type) {
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
                const filePath = path.join(options.outputPath, fileName);
                await this.writeToFile(filePath, result);
                break;
            case 'sendmail':
                transporter = createTransport({
                    sendmail: true,
                    path: options.path,
                });
                await this.sendMail(email, transporter);
                break;
            case 'smtp':
                transporter = createTransport({
                    host: options.host,
                    port: options.port,
                    secure: options.secure,
                    auth: options.auth.user,
                } as SMTPTransport.Options);
                await this.sendMail(email, transporter);
                break;
            default:
                return assertNever(options);
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
