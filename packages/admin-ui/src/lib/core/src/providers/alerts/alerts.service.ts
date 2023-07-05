import { Injectable } from '@angular/core';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { BehaviorSubject, combineLatest, interval, isObservable, Observable, Subject, switchMap } from 'rxjs';
import { map, mapTo, startWith, take } from 'rxjs/operators';

export interface AlertConfig<T = any> {
    id: string;
    check: () => T | Promise<T> | Observable<T>;
    recheckIntervalMs?: number;
    isAlert: (value: T) => boolean;
    action: (data: T) => void;
    label: (data: T) => { text: string; translationVars?: { [key: string]: string | number } };
}

export interface ActiveAlert {
    id: string;
    runAction: () => void;
    hasRun: boolean;
    label: { text: string; translationVars?: { [key: string]: string | number } };
}

export class Alert<T> {
    activeAlert$: Observable<ActiveAlert | undefined>;
    private hasRun$ = new BehaviorSubject(false);
    private data$ = new BehaviorSubject<T | undefined>(undefined);
    constructor(private config: AlertConfig<T>) {
        if (this.config.recheckIntervalMs) {
            interval(this.config.recheckIntervalMs).subscribe(() => this.runCheck());
        }
        this.activeAlert$ = combineLatest(this.data$, this.hasRun$).pipe(
            map(([data, hasRun]) => {
                if (!data) {
                    return;
                }
                const isAlert = this.config.isAlert(data);
                if (!isAlert) {
                    return;
                }
                return {
                    id: this.config.id,
                    runAction: () => {
                        if (!hasRun) {
                            this.config.action(data);
                            this.hasRun$.next(true);
                        }
                    },
                    hasRun,
                    label: this.config.label(data),
                };
            }),
        );
    }
    get id() {
        return this.config.id;
    }
    runCheck() {
        const result = this.config.check();
        if (result instanceof Promise) {
            result.then(data => this.data$.next(data));
        } else if (isObservable(result)) {
            result.pipe(take(1)).subscribe(data => this.data$.next(data));
        } else {
            this.data$.next(result);
        }
        this.hasRun$.next(false);
    }
}

@Injectable({
    providedIn: 'root',
})
export class AlertsService {
    activeAlerts$: Observable<ActiveAlert[]>;
    private alertsMap = new Map<string, Alert<any>>();
    private configUpdated = new Subject<void>();

    constructor() {
        const alerts$ = this.configUpdated.pipe(
            mapTo([...this.alertsMap.values()]),
            startWith([...this.alertsMap.values()]),
        );

        this.activeAlerts$ = alerts$.pipe(
            switchMap(() => {
                const alerts = [...this.alertsMap.values()];
                const isAlertStreams = alerts.map(alert => alert.activeAlert$);
                return combineLatest(isAlertStreams);
            }),
            map(alertStates => alertStates.filter(notNullOrUndefined)),
        );
    }

    configureAlert<T>(config: AlertConfig<T>) {
        this.alertsMap.set(config.id, new Alert(config));
        this.configUpdated.next();
    }

    refresh(id?: string) {
        if (id) {
            this.alertsMap.get(id)?.runCheck();
        } else {
            this.alertsMap.forEach(config => config.runCheck());
        }
    }
}
