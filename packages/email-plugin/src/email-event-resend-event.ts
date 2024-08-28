import { VendureEvent } from '@vendure/core';

import { EmailEventHandler } from './handler/event-handler';
import { EventWithContext } from './types';

/**
 * @description
 * This event is fired when an email resending attempt has been made.
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
