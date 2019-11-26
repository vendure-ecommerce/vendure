import { Observable, Observer } from 'rxjs';

/**
 * @description
 * Returns an observable which executes the given async work function and completes with
 * the returned value. This is useful in Worker Controller methods which need to return
 * an Observable but also want to work with async (Promise-returning) code.
 *
 * @example
 * ```TypeScript
 * \@Controller()
 * export class MyWorkerController {
 *
 *     \@MessagePattern('test')
 *     handleTest() {
 *         return asyncObservable(async observer => {
 *             const value = await this.connection.fetchSomething();
 *             return value;
 *         });
 *     }
 * }
 * ```
 *
 * @docsCategory worker
 */
export function asyncObservable<T>(work: (observer: Observer<T>) => Promise<T | void>): Observable<T> {
    return new Observable<T>(subscriber => {
        (async () => {
            try {
                const result = await work(subscriber);
                if (result) {
                    subscriber.next(result);
                }
                subscriber.complete();
            } catch (e) {
                subscriber.error(e);
            }
        })();
    });
}
