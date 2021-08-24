import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { RequestContext } from '../api/common/request-context';
import { TRANSACTION_MANAGER_KEY } from '../common/constants';

import { VendureEvent } from './vendure-event';

/**
 * @description
 * The EventBus is used to globally publish events which can then be subscribed to.
 *
 * Events are published whenever certain actions take place within the Vendure server, for example:
 *
 * * when a Product is updated ({@link ProductEvent})
 * * when an Order transitions state ({@link OrderStateTransitionEvent})
 * * when a Customer registers a new account ({@link AccountRegistrationEvent})
 *
 * Using the EventBus it is possible to subscribe to an take action when these events occur.
 * This is done with the `.ofType()` method, which takes an event type and returns an rxjs observable
 * stream of events:
 *
 * @example
 * ```TypeScript
 * import { OnApplicationBootstrap } from '\@nestjs/common';
 * import { EventBus, PluginCommonModule, VendurePlugin } from '\@vendure/core';
 * import { filter } from 'rxjs/operators';
 *
 * \@VendurePlugin({
 *     imports: [PluginCommonModule]
 * })
 * export class MyPlugin implements OnApplicationBootstrap {
 *
 *   constructor(private eventBus: EventBus) {}
 *
 *   async onApplicationBootstrap() {
 *
 *     this.eventBus
 *       .ofType(OrderStateTransitionEvent)
 *       .pipe(
 *         filter(event => event.toState === 'PaymentSettled'),
 *       )
 *       .subscribe((event) => {
 *         // do some action when this event fires
 *       });
 *   }
 * }
 * ```
 *
 * @docsCategory events
 * */
@Injectable()
export class EventBus implements OnModuleDestroy {
    private eventStream = new Subject<VendureEvent>();
    private destroy$ = new Subject();

    /**
     * @description
     * Publish an event which any subscribers can react to.
     */
    publish<T extends VendureEvent>(event: T): void {
        this.eventStream.next(this.prepareRequestContext(event));
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

    /** @internal */
    onModuleDestroy(): any {
        this.destroy$.next();
    }

    /**
     * If the Event includes a RequestContext property, we need to:
     *
     * 1) Set it as a copy of the original
     * 2) Remove the TRANSACTION_MANAGER_KEY from that copy
     *
     * The TRANSACTION_MANAGER_KEY is used to track transactions across calls
     * (this is why we always pass the `ctx` object to get TransactionalConnection.getRepository() method).
     * However, allowing a transaction to continue in an async event subscriber function _will_ cause
     * very confusing issues (see https://github.com/vendure-ecommerce/vendure/issues/520), which is why
     * we simply remove the reference to the transaction manager from the context object altogether.
     */
    private prepareRequestContext<T extends VendureEvent>(event: T): T {
        for (const propertyName of Object.getOwnPropertyNames(event)) {
            const property = event[propertyName as keyof T];
            if (property instanceof RequestContext) {
                const ctxCopy = property.copy();
                delete (ctxCopy as any)[TRANSACTION_MANAGER_KEY];
                (event[propertyName as keyof T] as any) = ctxCopy;
            }
        }
        return event;
    }
}
