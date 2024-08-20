import { RequestContext, VendureEvent } from '@vendure/core';

import { TextMessageDetails } from './types';

/**
 * @description
 * This event is fired when a text message sending attempt has been made. If the sending was successful,
 * the `success` property will be `true`, and if not, the `error` property will contain the error
 * which occurred.
 *
 * @docsCategory core plugins/TextMessagePlugin
 * @since 2.2.0
 */
export class TextMessageSendEvent extends VendureEvent {
    constructor(
        public readonly ctx: RequestContext,
        public readonly details: TextMessageDetails,
        public readonly success: boolean,
        public readonly error?: Error,
    ) {
        super();
    }
}
