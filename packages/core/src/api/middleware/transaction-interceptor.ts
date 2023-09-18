import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';

import { RequestContext } from '..';
import { REQUEST_CONTEXT_KEY, REQUEST_CONTEXT_MAP_KEY } from '../../common/constants';
import { TransactionWrapper } from '../../connection/transaction-wrapper';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { parseContext } from '../common/parse-context';
import {
    TransactionMode,
    TRANSACTION_MODE_METADATA_KEY,
    TransactionIsolationLevel,
    TRANSACTION_ISOLATION_LEVEL_METADATA_KEY,
} from '../decorators/transaction.decorator';

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
        const ctx: RequestContext | undefined = (req as any)[REQUEST_CONTEXT_KEY];
        if (ctx) {
            const transactionMode = this.reflector.get<TransactionMode>(
                TRANSACTION_MODE_METADATA_KEY,
                context.getHandler(),
            );
            const transactionIsolationLevel = this.reflector.get<TransactionIsolationLevel | undefined>(
                TRANSACTION_ISOLATION_LEVEL_METADATA_KEY,
                context.getHandler(),
            );

            return of(
                this.transactionWrapper.executeInTransaction(
                    ctx,
                    _ctx => {
                        this.registerTransactionalContext(_ctx, context.getHandler(), req);

                        return next.handle();
                    },
                    transactionMode,
                    transactionIsolationLevel,
                    this.connection.rawConnection,
                ),
            );
        } else {
            return next.handle();
        }
    }

    /**
     * Registers transactional request context associated with execution handler function
     *
     * @param ctx transactional request context
     * @param handler handler function from ExecutionContext
     * @param req Request object
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    registerTransactionalContext(ctx: RequestContext, handler: Function, req: any) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const map: Map<Function, RequestContext> = req[REQUEST_CONTEXT_MAP_KEY] || new Map();
        map.set(handler, ctx);

        req[REQUEST_CONTEXT_MAP_KEY] = map;
    }
}
