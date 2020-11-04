import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { retryWhen, take, tap } from 'rxjs/operators';
import { QueryRunner } from 'typeorm';
import { TransactionAlreadyStartedError } from 'typeorm/error/TransactionAlreadyStartedError';

import { REQUEST_CONTEXT_KEY, TRANSACTION_MANAGER_KEY } from '../../common/constants';
import { TransactionalConnection } from '../../service/transaction/transactional-connection';
import { parseContext } from '../common/parse-context';
import { RequestContext } from '../common/request-context';
import { TransactionMode, TRANSACTION_MODE_METADATA_KEY } from '../decorators/transaction.decorator';

/**
 * @description
 * Used by the {@link Transaction} decorator to create a transactional query runner
 * and attach it to the RequestContext.
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private connection: TransactionalConnection, private reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { isGraphQL, req } = parseContext(context);
        const ctx = (req as any)[REQUEST_CONTEXT_KEY];
        if (ctx) {
            const transactionMode = this.reflector.get<TransactionMode>(
                TRANSACTION_MODE_METADATA_KEY,
                context.getHandler(),
            );
            return of(this.withTransaction(ctx, () => next.handle(), transactionMode));
        } else {
            return next.handle();
        }
    }

    /**
     * @description
     * Executes the `work` function within the context of a transaction.
     */
    private async withTransaction<T>(
        ctx: RequestContext,
        work: () => Observable<T>,
        mode: TransactionMode,
    ): Promise<T> {
        const queryRunnerExists = !!(ctx as any)[TRANSACTION_MANAGER_KEY];
        if (queryRunnerExists) {
            // If a QueryRunner already exists on the RequestContext, there must be an existing
            // outer transaction in progress. In that case, we just execute the work function
            // as usual without needing to further wrap in a transaction.
            return work().toPromise();
        }
        const queryRunner = this.connection.rawConnection.createQueryRunner();
        if (mode === 'auto') {
            await this.startTransaction(queryRunner);
        }
        (ctx as any)[TRANSACTION_MANAGER_KEY] = queryRunner.manager;

        try {
            const maxRetries = 5;
            const result = await work()
                .pipe(
                    retryWhen(errors =>
                        errors.pipe(
                            tap(err => {
                                if (!this.isRetriableError(err)) {
                                    throw err;
                                }
                            }),
                            take(maxRetries),
                        ),
                    ),
                )
                .toPromise();
            if (queryRunner.isTransactionActive) {
                await queryRunner.commitTransaction();
            }
            return result;
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        } finally {
            if (queryRunner?.isReleased === false) {
                await queryRunner.release();
            }
        }
    }

    /**
     * Attempts to start a DB transaction, with retry logic in the case that a transaction
     * is already started for the connection (which is mainly a problem with SQLite/Sql.js)
     */
    private async startTransaction(queryRunner: QueryRunner) {
        const maxRetries = 25;
        let attempts = 0;
        let lastError: any;
        // Returns false if a transaction is already in progress
        async function attemptStartTransaction(): Promise<boolean> {
            try {
                await queryRunner.startTransaction();
                return true;
            } catch (err) {
                lastError = err;
                if (err instanceof TransactionAlreadyStartedError) {
                    return false;
                }
                throw err;
            }
        }
        while (attempts < maxRetries) {
            const result = await attemptStartTransaction();
            if (result) {
                return;
            }
            attempts++;
            // insert an increasing delay before retrying
            await new Promise(resolve => setTimeout(resolve, attempts * 20));
        }
        throw lastError;
    }

    /**
     * If the resolver function throws an error, there are certain cases in which
     * we want to retry the whole thing again - notably in the case of a deadlock
     * situation, which can usually be retried with success.
     */
    private isRetriableError(err: any): boolean {
        const mysqlDeadlock = err.code === 'ER_LOCK_DEADLOCK';
        const postgresDeadlock = err.code === 'deadlock_detected';
        return mysqlDeadlock || postgresDeadlock;
    }
}
