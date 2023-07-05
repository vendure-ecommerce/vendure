import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { Observable, Subject } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { EntityManager } from 'typeorm';

import { RequestContext } from '../api/common/request-context';
import { TRANSACTION_MANAGER_KEY } from '../common/constants';
import { TransactionSubscriber, TransactionSubscriberError } from '../connection/transaction-subscriber';

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
    private destroy$ = new Subject<void>();

    constructor(private transactionSubscriber: TransactionSubscriber) {}

    /**
     * @description
     * Publish an event which any subscribers can react to.
     */
    publish<T extends VendureEvent>(event: T): void {
        this.eventStream.next(event);
    }

    /**
     * @description
     * Returns an RxJS Observable stream of events of the given type.
     * If the event contains a {@link RequestContext} object, the subscriber
     * will only get called after any active database transactions are complete.
     *
     * This means that the subscriber function can safely access all updated
     * data related to the event.
     */
    ofType<T extends VendureEvent>(type: Type<T>): Observable<T> {
        return this.eventStream.asObservable().pipe(
            takeUntil(this.destroy$),
            filter(e => e.constructor === type),
            mergeMap(event => this.awaitActiveTransactions(event)),
            filter(notNullOrUndefined),
        ) as Observable<T>;
    }

    /**
     * @description
     * Returns an RxJS Observable stream of events filtered by a custom predicate.
     * If the event contains a {@link RequestContext} object, the subscriber
     * will only get called after any active database transactions are complete.
     *
     * This means that the subscriber function can safely access all updated
     * data related to the event.
     */
    filter<T extends VendureEvent>(predicate: (event: VendureEvent) => boolean): Observable<T> {
        return this.eventStream.asObservable().pipe(
            takeUntil(this.destroy$),
            filter(e => predicate(e)),
            mergeMap(event => this.awaitActiveTransactions(event)),
            filter(notNullOrUndefined),
        ) as Observable<T>;
    }

    /** @internal */
    onModuleDestroy(): any {
        this.destroy$.next();
    }

    /**
     * If the Event includes a RequestContext property, we need to check for any active transaction
     * associated with it, and if there is one, we await that transaction to either commit or rollback
     * before publishing the event.
     *
     * The reason for this is that if the transaction is still active when event subscribers execute,
     * this can cause a couple of issues:
     *
     * 1. If the transaction hasn't completed by the time the subscriber runs, the new data inside
     *  the transaction will not be available to the subscriber.
     * 2. If the subscriber gets a reference to the EntityManager which has an active transaction,
     *   and then the transaction completes, and then the subscriber attempts a DB operation using that
     *   EntityManager, a fatal QueryRunnerAlreadyReleasedError will be thrown.
     *
     * For more context on these two issues, see:
     *
     * * https://github.com/vendure-ecommerce/vendure/issues/520
     * * https://github.com/vendure-ecommerce/vendure/issues/1107
     */
    private async awaitActiveTransactions<T extends VendureEvent>(event: T): Promise<T | undefined> {
        const entry = Object.entries(event).find(([_, value]) => value instanceof RequestContext);

        if (!entry) {
            return event;
        }

        const [key, ctx]: [string, RequestContext] = entry;

        const transactionManager: EntityManager | undefined = (ctx as any)[TRANSACTION_MANAGER_KEY];
        if (!transactionManager?.queryRunner) {
            return event;
        }

        try {
            await this.transactionSubscriber.awaitCommit(transactionManager.queryRunner);

            // Copy context and remove transaction manager
            // This will prevent queries to released query runner
            const newContext = ctx.copy();
            delete (newContext as any)[TRANSACTION_MANAGER_KEY];

            // Reassign new context
            (event as any)[key] = newContext;

            return event;
        } catch (e: any) {
            if (e instanceof TransactionSubscriberError) {
                // Expected commit, but rollback or something else happened.
                // This is still reliable behavior, return undefined
                // as event should not be exposed from this transaction
                return;
            }

            throw e;
        }
    }
}
