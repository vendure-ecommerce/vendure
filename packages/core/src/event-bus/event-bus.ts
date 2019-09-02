import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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
export class EventBus implements OnModuleDestroy {
    private subscriberMap = new Map<Type<VendureEvent>, Array<EventHandler<any>>>();
    private eventStream = new Subject<VendureEvent>();
    private destroy$ = new Subject();

    /**
     * @description
     * Publish an event which any subscribers can react to.
     */
    publish<T extends VendureEvent>(event: T): void {
        const eventType = (event as any).constructor;
        const handlers = this.subscriberMap.get(eventType);
        if (handlers) {
            const length = handlers.length;
            for (let i = 0; i < length; i++) {
                handlers[i](event);
            }
        }
        this.eventStream.next(event);
    }

    /**
     * @description
     * Returns an RxJS Observable stream of events of the given type.
     */
    ofType<T extends VendureEvent>(type: Type<T>): Observable<T> {
        return this.eventStream.asObservable().pipe(
            takeUntil(this.destroy$),
            filter(e => (e as any).constructor === type),
        ) as Observable<T>;
    }

    /**
     * @description
     * Deprecated: use `ofType()` instead.
     *
     * Subscribe to the given event type. Returns an unsubscribe function which can be used
     * to unsubscribe the handler from the event.
     *
     * @deprecated
     */
    subscribe<T extends VendureEvent>(type: Type<T>, handler: EventHandler<T>): UnsubscribeFn {
        const handlers = this.subscriberMap.get(type) || [];
        if (!handlers.includes(handler)) {
            handlers.push(handler);
        }
        this.subscriberMap.set(type, handlers);
        return () => this.subscriberMap.set(type, handlers.filter(h => h !== handler));
    }

    /** @internal */
    onModuleDestroy(): any {
        this.destroy$.next();
    }
}
