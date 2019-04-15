import { normalizeString } from '@vendure/common/lib/normalize-string';
import { assertNever } from '@vendure/common/lib/shared-utils';
import fs from 'fs-extra';
import { createTransport } from 'nodemailer';
import { default as Mail } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';
import { Stream } from 'stream';

import { EmailDetails, EmailTransportOptions } from './types';

export type StreamTransportInfo = {
    envelope: {
        from: string;
        to: string[];
    };
    messageId: string;
    message: Stream;
};

/**
 * Uses the configured transport to send the generated email.
 */
export class EmailSender {
    async send(email: EmailDetails, options: EmailTransportOptions) {
        let transporter: Mail;
        switch (options.type) {
            case 'none':
                return;
                break;
            case 'file':
                const fileName = normalizeString(
                    `${new Date().toISOString()} ${email.recipient} ${email.subject}`,
                    '_',
                );
                const filePath = path.join(options.outputPath, fileName);
                if (options.raw) {
                    await this.sendFileRaw(email, filePath);
                } else {
                    await this.sendFileJson(email, filePath);
                }
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
            case 'testing':
                options.onSend(email);
                break;
            default:
                return assertNever(options);
        }
    }

    private async sendMail(email: EmailDetails, transporter: Mail): Promise<any> {
        return transporter.sendMail({
            to: email.recipient,
            subject: email.subject,
            html: email.body,
        });
    }

    private async sendFileJson(email: EmailDetails, pathWithoutExt: string) {
        const output = {
            date: new Date().toLocaleString(),
            recipient: email.recipient,
            subject: email.subject,
            body: email.body,
        };
        await fs.writeFile(pathWithoutExt + '.json', JSON.stringify(output, null, 2));
    }

    private async sendFileRaw(email: EmailDetails, pathWithoutExt: string) {
        const transporter = createTransport({
            streamTransport: true,
            buffer: true,
        });
        const result = await this.sendMail(email, transporter);
        await this.writeStreamToFile(pathWithoutExt + '.txt', result);
    }

    private async writeStreamToFile(filePath: string, info: StreamTransportInfo): Promise<string> {
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
