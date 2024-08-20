import { Type } from '@vendure/common/lib/shared-types';

import { TextMessageEventHandler } from './handler/event-handler';
import { EventWithContext } from './types';

/**
 * @description
 * An EmailEventListener is used to listen for events and set up a {@link TextMessageEventHandler} which
 * defines how an email will be generated from this event.
 *
 * @docsCategory core plugins/EmailPlugin
 */
export class EmailEventListener<T extends string> {
    public type: T;
    constructor(type: T) {
        this.type = type;
    }

    /**
     * @description
     * Defines the event to listen for.
     */
    on<Event extends EventWithContext>(event: Type<Event>): TextMessageEventHandler<T, Event> {
        return new TextMessageEventHandler<T, Event>(this, event);
    }
}
