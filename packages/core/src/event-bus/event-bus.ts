import { Injectable } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';

import { VendureEvent } from './vendure-event';

export type EventHandler<T extends VendureEvent> = (event: T) => void;
export type UnsubscribeFn = () => void;

/**
 * @description
 * The EventBus is used to globally publish events which can then be subscribed to.
 *
 * @docsCategory events
 * */
@Injectable()
export class EventBus {
    private subscriberMap = new Map<Type<VendureEvent>, Array<EventHandler<any>>>();

    /**
     * @description
     * Publish an event which any subscribers can react to.
     */
    publish(event: VendureEvent): void {
        const eventType = (event as any).constructor;
        const handlers = this.subscriberMap.get(eventType);
        if (handlers) {
            const length = handlers.length;
            for (let i = 0; i < length; i++) {
                handlers[i](event);
            }
        }
    }

    /**
     * @description
     * Subscribe to the given event type. Returns an unsubscribe function which can be used
     * to unsubscribe the handler from the event.
     */
    subscribe<T extends VendureEvent>(type: Type<T>, handler: EventHandler<T>): UnsubscribeFn {
        const handlers = this.subscriberMap.get(type) || [];
        if (!handlers.includes(handler)) {
            handlers.push(handler);
        }
        this.subscriberMap.set(type, handlers);
        return () => this.subscriberMap.set(type, handlers.filter(h => h !== handler));
    }
}
