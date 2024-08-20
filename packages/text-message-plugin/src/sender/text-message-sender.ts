import { InjectableStrategy } from '@vendure/core';

import { TextMessageDetails, TextMessageTransportOptions } from '../types';

/**
 * @description
 * An TextMessageSender is responsible for sending the text message, e.g. via an SMTP connection
 * or using some other mail-sending API. By default, the EmailPlugin uses the
 * {@link NodemailerEmailSender}, but it is also possible to supply a custom implementation:
 *
 * @example
 * ```ts
 * // Your AccountSID and Auth Token from console.twilio.com
 * const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
 * const authToken = 'your_auth_token';
 *
 * const client = require('twilio')(accountSid, authToken);
 *
 * class TwilioTextMessageSender implements TextMessageSender {
 *   async send(textMessage: TextMessageDetails) {
 *     await client.messages.create({
 *       to: textMessage.to,
 *       from: textMessage.from,
 *       body: textMessage.body,
 *     });
 *   }
 * }
 *
 * const config: VendureConfig = {
 *   logger: new DefaultLogger({ level: LogLevel.Debug })
 *   // ...
 *   plugins: [
 *     TextMessagePlugin.init({
 *        // ... template, handler config omitted
 *       transport: { type: 'none' },
 *       textMessageSender: new TwilioTextMessageSender(),
 *     }),
 *   ],
 * };
 * ```
 *
 * @docsCategory core plugins/TextMessagePlugin
 * @docsPage TextMessageSender
 * @docsWeight 0
 */
export interface TextMessageSender extends InjectableStrategy {
    send: (email: TextMessageDetails, options: TextMessageTransportOptions) => void | Promise<void>;
}
