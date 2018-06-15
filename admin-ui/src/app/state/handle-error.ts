import {EMPTY, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * An error-handling operator which will execute the onErrorSideEffect() function and then
 * catch the error and complete the stream, so that any further operators are bypassed.
 *
 * Designed to be used with the .let() operator or in the pipable style.
 *
 * @example
 * ```
 * this.dataService.fetchData()
 *  .let(handleError(err => this.store.dispatch(new Actions.FetchError(err)))
 *  .do(data => this.store.dispatch(new Actions.FetchSuccess(data))
 *  .subscribe();
 * ```
 */
export function handleError<T>(onErrorSideEffect: (err: any) => void): (observable: Observable<T>) => Observable<T> {
    return (observable: Observable<T>) => observable.pipe(
        catchError(err => {
            onErrorSideEffect(err);
            return EMPTY;
        }));
}
