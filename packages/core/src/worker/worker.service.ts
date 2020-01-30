import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, finalize, mergeMap, take } from 'rxjs/operators';

import { VENDURE_WORKER_CLIENT } from './constants';
import { WorkerMessage } from './types';

/**
 * @description
 * This service is responsible for sending messages to the Worker process. See the {@link WorkerMessage}
 * docs for an example of usage.
 *
 * @docsCategory worker
 */
@Injectable()
export class WorkerService implements OnModuleDestroy {
    private pendingConnection = false;
    private initialConnection = new BehaviorSubject(false);
    constructor(@Inject(VENDURE_WORKER_CLIENT) private readonly client: ClientProxy) {}

    /**
     * @description
     * Sends a {@link WorkerMessage} to the worker process, where there should be a Controller with a method
     * listening out for the message's pattern.
     */
    send<T, R>(message: WorkerMessage<T, R>): Observable<R> {
        // The rather convoluted logic here is required in order to prevent more than
        // one connection being opened in the event that the `send` method is called multiple
        // times in the same event loop tick.
        // On the first invokation, the first path is taken, which establishes the single
        // connection (implicit in the first call to ClientProxt.send()). All subsequent
        // invokations take the second code path.
        if (!this.pendingConnection && this.initialConnection.value === false) {
            this.pendingConnection = true;
            return this.client
                .send<R, T>((message.constructor as typeof WorkerMessage).pattern, message.data)
                .pipe(
                    finalize(() => {
                        this.initialConnection.next(true);
                        this.pendingConnection = false;
                    }),
                );
        } else {
            return this.initialConnection.pipe(
                filter(val => val),
                take(1),
                mergeMap(() => {
                    return this.client.send<R, T>(
                        (message.constructor as typeof WorkerMessage).pattern,
                        message.data,
                    );
                }),
            );
        }
    }

    /** @internal */
    onModuleDestroy() {
        this.client.close();
    }
}
