import type { TextMessageSender } from './text-message-sender'
import type { TextMessageDetails, TextMessageTransportOptions } from '../types'
import { normalizeString } from '@vendure/common/lib/normalize-string'
import { assertNever } from '@vendure/common/lib/shared-utils'
import fs from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Stream } from 'node:stream'
import { Readable } from 'node:stream'

export interface StreamTransportInfo {
    envelope: {
        from: string
        to: string[]
    }
    messageId: string
    message: Stream
}

function createTransport(_args: any) {
    return {
        sendMail: (options: Omit<TextMessageDetails & { html: string }, 'body' | 'recipient'>) => Promise.resolve({
            messageId: crypto.randomUUID(),
            envelope: {
                from: options.from,
                to: options.to,
            },
            message: Readable.from(options.html),
        }),
    }
}

type Mail = ReturnType<typeof createTransport>

export class TestingTextMessageSender implements TextMessageSender {
    private _smtpTransport: Mail | undefined
    private _sendMailTransport: Mail | undefined
    private _sesTransport: Mail | undefined

    async send(email: TextMessageDetails, options: TextMessageTransportOptions) {
        switch (options.type) {
            case 'none': {
                return
            }
            case 'file': {
                const fileName = normalizeString(`${new Date().toISOString()} ${email.recipient}`, '_')
                const filePath = path.join(options.outputPath, fileName)

                if (options.raw)
                    await this.sendFileRaw(email, filePath)
                else
                    await this.sendFileJson(email, filePath)
                break
            }
            // case 'sendmail':
            //   await this.sendMail(email, this.getSendMailTransport(options))
            //   break
            // case 'ses':
            //   await this.sendMail(email, this.getSesTransport(options))
            //   break
            // case 'smtp':
            //   await this.sendMail(email, this.getSmtpTransport(options))
            //   break
            case 'testing': {
                options.onSend(email)
                break
            }
            default: {
                return assertNever(options as never)
            }
        }
    }

    private async sendMail(email: TextMessageDetails, transporter: Mail): Promise<any> {
        return transporter.sendMail({
            from: email.from,
            to: email.recipient,
            html: email.body,
            attachments: email.attachments,
            cc: email.cc,
            bcc: email.bcc,
            replyTo: email.replyTo,
        })
    }

    private async sendFileJson(email: TextMessageDetails, pathWithoutExt: string) {
        const output = {
            date: new Date().toLocaleString(),
            from: email.from,
            recipient: email.recipient,
            body: email.body,
            cc: email.cc,
            bcc: email.bcc,
            replyTo: email.replyTo,
        }
        await writeFile(`${pathWithoutExt}.json`, JSON.stringify(output, null, 2))
    }

    private async sendFileRaw(email: TextMessageDetails, pathWithoutExt: string) {
        const transporter = createTransport({
            streamTransport: true,
            buffer: true,
        })
        const result = await this.sendMail(email, transporter) as StreamTransportInfo
        await this.writeStreamToFile(`${pathWithoutExt}.txt`, result)
    }

    private async writeStreamToFile(filePath: string, info: StreamTransportInfo): Promise<string> {
        const writeStream = fs.createWriteStream(filePath)
        return new Promise<string>((resolve, reject) => {
            writeStream.on('open', () => {
                info.message.pipe(writeStream)
                writeStream.on('close', resolve)
                writeStream.on('error', reject)
            })
        })
    }

    // private getSmtpTransport(options: SMTPTransportOptions) {
    //   if (!this._smtpTransport) {
    //     (options as any).logger = options.logging ? this.createLogger() : false
    //     this._smtpTransport = createTransport(options)
    //   }
    //   return this._smtpTransport
    // }

    // private getSesTransport(options: SESTransportOptions) {
    //   if (!this._sesTransport)
    //     this._sesTransport = createTransport(options)
    //
    //   return this._sesTransport
    // }

    // private getSendMailTransport(options: SendmailTransportOptions) {
    //   if (!this._sendMailTransport)
    //     this._sendMailTransport = createTransport({ sendmail: true, ...options })
    //
    //   return this._sendMailTransport
    // }

    // private createLogger() {
    //   function formatError(args: [object, string, ...string[]]) {
    //     const [_ctx, message, ...params] = args
    //     return format(message, ...params)
    //   }
    //   return {
    //     level(_level: LoggerLevel) {
    //       /* noop */
    //     },
    //     trace(...params: any) {
    //       Logger.debug(formatError(params), loggerCtx)
    //     },
    //     debug(...params: any) {
    //       Logger.verbose(formatError(params), loggerCtx)
    //     },
    //     info(...params: any) {
    //       Logger.info(formatError(params), loggerCtx)
    //     },
    //     warn(...params: any) {
    //       Logger.warn(formatError(params), loggerCtx)
    //     },
    //     error(...params: any) {
    //       Logger.error(formatError(params), loggerCtx)
    //     },
    //     fatal(...params: any) {
    //       Logger.error(formatError(params), loggerCtx)
    //     },
    //   }
    // }
}
