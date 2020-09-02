import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { REQUEST_CONTEXT_KEY, TRANSACTION_MANAGER_KEY } from '../../common/constants';
import { TransactionalConnection } from '../../service/transaction/transactional-connection';
import { parseContext } from '../common/parse-context';
import { RequestContext } from '../common/request-context';

/**
 * @description
 * Used by the {@link Transaction} decorator to create a transactional query runner
 * and attach it to the RequestContext.
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private connection: TransactionalConnection) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { isGraphQL, req } = parseContext(context);
        const ctx = (req as any)[REQUEST_CONTEXT_KEY];
        if (ctx) {
            return of(this.withTransaction(ctx, () => next.handle().toPromise()));
        } else {
            return next.handle();
        }
    }

    /**
     * @description
     * Executes the `work` function within the context of a transaction.
     */
    private async withTransaction<T>(ctx: RequestContext, work: () => T): Promise<T> {
        const queryRunnerExists = !!(ctx as any)[TRANSACTION_MANAGER_KEY];
        if (queryRunnerExists) {
            // If a QueryRunner already exists on the RequestContext, there must be an existing
            // outer transaction in progress. In that case, we just execute the work function
            // as usual without needing to further wrap in a transaction.
            return work();
        }
        const queryRunner = this.connection.rawConnection.createQueryRunner();
        await queryRunner.startTransaction();
        (ctx as any)[TRANSACTION_MANAGER_KEY] = queryRunner.manager;

        try {
            const result = await work();
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
            await queryRunner.release();
        }
    }
}
