import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { WorkerMonitor } from './worker-monitor';

/**
 * This interceptor is used to keep track of open worker tasks, so that the WorkerModule
 * is not allowed to be destroyed while tasks are in progress.
 */
@Injectable()
export class MessageInterceptor implements NestInterceptor {
    constructor(private monitor: WorkerMonitor) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        this.monitor.increment();
        return next
            .handle()
            .pipe(
                finalize(() => {
                    this.monitor.decrement();
                }),
            );
    }
}
