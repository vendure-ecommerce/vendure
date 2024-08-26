import { RequestContext, VendureEvent } from '@vendure/core';

import { EmailEventHandler } from './handler/event-handler';
import { EmailDetails, EventWithContext } from './types';

/**
 * @description
 * This event is fired when an email resending attempt has been made. If the sending was successful,
 * the `success` property will be `true`, and if not, the `error` property will contain the error
 * which occurred.
 *
 * @docsCategory core plugins/EmailPlugin
 * @since 3.0.2
 */
export class EmailEventResend extends VendureEvent {
    constructor(
        public readonly handler: EmailEventHandler,
        public readonly event: EventWithContext,
    ) {
        super();
    }
}
