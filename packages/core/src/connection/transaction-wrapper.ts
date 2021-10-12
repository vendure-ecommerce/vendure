import { from, Observable, of } from 'rxjs';
import { retryWhen, take, tap } from 'rxjs/operators';
import { Connection, QueryRunner } from 'typeorm';
import { TransactionAlreadyStartedError } from 'typeorm/error/TransactionAlreadyStartedError';

import { RequestContext } from '../api/common/request-context';
import { TransactionMode } from '../api/decorators/transaction.decorator';
import { TRANSACTION_MANAGER_KEY } from '../common/constants';

/**
 * @description
 * This helper class is used to wrap operations in a TypeORM transaction in order to ensure
 * atomic operations on the database.
 */
export class TransactionWrapper {
    /**
     * @description
     * Executes the `work` function within the context of a transaction. If the `work` function
     * resolves / completes, then all the DB operations it contains will be committed. If it
     * throws an error or rejects, then all DB operations will be rolled back.
     */
    async executeInTransaction<T>(
        ctx: RequestContext,
        work: () => Observable<T> | Promise<T>,
        mode: TransactionMode,
        connection: Connection,
    ): Promise<T> {
        const queryRunnerExists = !!(ctx as any)[TRANSACTION_MANAGER_KEY];
        if (queryRunnerExists) {
            // If a QueryRunner already exists on the RequestContext, there must be an existing
            // outer transaction in progress. In that case, we just execute the work function
            // as usual without needing to further wrap in a transaction.
            return from(work()).toPromise();
        }
        const queryRunner = connection.createQueryRunner();
        if (mode === 'auto') {
            await this.startTransaction(queryRunner);
        }
        (ctx as any)[TRANSACTION_MANAGER_KEY] = queryRunner.manager;

        try {
            const maxRetries = 5;
            const result = await from(work())
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
