import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';

import { REQUEST_CONTEXT_KEY } from '../../common/constants';
import { TransactionWrapper } from '../../connection/transaction-wrapper';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { parseContext } from '../common/parse-context';
import { TransactionMode, TRANSACTION_MODE_METADATA_KEY } from '../decorators/transaction.decorator';

/**
 * @description
 * Used by the {@link Transaction} decorator to create a transactional query runner
 * and attach it to the RequestContext.
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(
        private connection: TransactionalConnection,
        private transactionWrapper: TransactionWrapper,
        private reflector: Reflector,
    ) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { isGraphQL, req } = parseContext(context);
        const ctx = (req as any)[REQUEST_CONTEXT_KEY];
        if (ctx) {
            const transactionMode = this.reflector.get<TransactionMode>(
                TRANSACTION_MODE_METADATA_KEY,
                context.getHandler(),
            );
            return of(
                this.transactionWrapper.executeInTransaction(
                    ctx,
                    () => next.handle(),
                    transactionMode,
                    this.connection.rawConnection,
                ),
            );
        } else {
            return next.handle();
        }
    }
}
