import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import { createTransport } from 'nodemailer';
import { default as Mail } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';
import { Stream } from 'stream';

import { normalizeString } from '../../../../shared/normalize-string';
import { assertNever } from '../../../../shared/shared-utils';
import { EmailTransportOptions, FileTransportOptions } from '../config/email/email-transport-options';

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
                const fileName = normalizeString(
                    `${new Date().toISOString()} ${email.recipient} ${email.subject}`,
                    '_',
                );
                const filePath = path.join(options.outputPath, fileName);
                if (options.raw) {
                    await this.sendFileRaw(email, filePath);
                } else {
                    await this.sendFileHtml(email, filePath);
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

    private async sendMail(email: GeneratedEmailContext, transporter: Mail): Promise<any> {
        return transporter.sendMail({
            to: email.recipient,
            subject: email.subject,
            html: email.body,
        });
    }

    private async sendFileHtml(email: GeneratedEmailContext, pathWithoutExt: string) {
        const content = `<html lang="en">
            <head>
                <title>${email.subject}</title>
                <style>
                    body {
                        display: flex;
                        flex-direction: column;
                        font-family: Helvetica, Arial, sans-serif;
                    }
                    iframe {
                        flex: 1;
                        border: 1px solid #aaa;
                    }
                </style>
            </head>
            <body>
            <div class="metadata">
                <table>
                    <tr>
                        <td>Recipient:</td>
                        <td>${email.recipient}</td>
                    </tr>
                    <tr>
                        <td>Subject:</td>
                        <td>${email.subject}</td>
                    </tr>
                    <tr>
                        <td>Date:</td>
                        <td>${new Date().toLocaleString()}</td>
                    </tr>
                </table>
            </div>
            <iframe srcdoc="${email.body.replace(/"/g, '&quot;')}"></iframe>
            </body>
            </html>
        `;

        await fs.writeFile(pathWithoutExt + '.html', content);
    }

    private async sendFileRaw(email: GeneratedEmailContext, pathWithoutExt: string) {
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
