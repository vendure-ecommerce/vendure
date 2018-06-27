import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from './app-state';
import { distinctUntilChanged, take } from 'rxjs/operators';

/**
 * Wrapper class which wraps the @ngrx/store Store object, and also provides additional
 * convenience methods for accessing data.
 */
@Injectable()
export class StateStore {

    observeStateSubscriptions: Subscription[] = [];

    constructor(public _internalStore: Store<AppState>) {
        // expose the AppStore on the window for debug purposes
        Object.defineProperty(window, 'vnd_app_state', {
            get: () => this.getState(),
        });
        // allow observing of particular state for debug purposes
        Object.defineProperty(window, 'vnd_observe_state', {
            get: () => this.observeState.bind(this),
        });
    }

    /**
     * The store object can be manually set (mainly for testing purposes).
     */
    public setStore(store): void {
        this._internalStore = store;
    }

    public getState(): AppState {
        // Hacky typing here because TypeScript does not know that .take().subscribe() is a
        // synchronous operation, and therefore complains that "state" has not been assigned
        // when it is returned.
        let state = {} as any;
        this._internalStore.pipe(take(1)).subscribe(s => state = s);
        return state;
    }

    public select<T>(selector: (state: AppState) => T): Observable<T> {
        return this._internalStore.select<T>(selector).pipe(
            distinctUntilChanged());
    }

    public dispatch(action: Action): void {
        return this._internalStore.dispatch(action);
    }

    public subscribe(callback: (_) => any): Subscription {
        return this._internalStore.subscribe(callback);
    }

    /**
     * Allows the creation of ad-hoc subscriptions to the app state, and logs the value whenever that part of the state changes.
     *
     * Returns an unsubscribe function.
     */
    public observeState(selector: (state: AppState) => any): (() => void) | void  {
        let hasError = false;

        // tslint:disable:no-console
        const sub = this.select(selector)
            .subscribe(
                value => console.log(`%c ${selector.toString()}:`, 'color: #0d35a9;', value),
                err => {
                    console.log(`%c "${selector.toString()}" is an invalid selector function:`, 'color: #f00', err.message);
                    hasError = true;
                }
            );
        // tslint:enable:no-console

        if (!hasError) {
            this.observeStateSubscriptions.push(sub);
            return () => {
                sub.unsubscribe();
                const index = this.observeStateSubscriptions.indexOf(sub);
                this.observeStateSubscriptions.splice(index, 1);
            };
        }
    }
}
