import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, takeWhile, tap } from 'rxjs/operators';

import { Logger } from '../config/logger/vendure-logger';

/**
 * This service is responsible for keeping track of incomplete worker tasks
 * to ensure that the WorkerModule is not destroyed before active tasks complete.
 */
@Injectable()
export class WorkerMonitor {
    openTasks = new BehaviorSubject<number>(0);
    get openTaskCount(): number {
        return this.openTasks.value;
    }
    increment() {
        this.openTasks.next(this.openTasks.value + 1);
    }
    decrement() {
        this.openTasks.next(this.openTasks.value - 1);
    }
    waitForOpenTasksToComplete(): Promise<number> {
        if (0 < this.openTaskCount) {
            Logger.info('Waiting for open worker tasks to complete...');
        }
        return this.openTasks.asObservable().pipe(
            tap(count => {
                if (0 < count) {
                    Logger.info(`${count} tasks open`);
                }
            }),
            debounceTime(100),
            takeWhile(value => value > 0),
        ).toPromise();
    }
}
