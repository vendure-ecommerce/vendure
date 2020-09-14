import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';

import { TransactionInterceptor } from '../middleware/transaction-interceptor';

export const TRANSACTION_MODE_METADATA_KEY = '__transaction_mode__';
/**
 * @description
 * When in `auto` mode, a transaction will be automatically started before the resolver
 * runs and committed after it ends (or rolled back in case of error).
 *
 * In `manual` mode, the application code itself must start and commit the transactions.
 *
 * @default 'auto'
 * @docsCategory data-access
 */
export type TransactionMode = 'auto' | 'manual';

/**
 * @description
 * Runs the decorated method in a TypeORM transaction. It works by creating a transctional
 * QueryRunner which gets attached to the RequestContext object. When the RequestContext
 * is the passed to the {@link TransactionalConnection} `getRepository()` method, this
 * QueryRunner is used to execute the queries within this transaction.
 *
 * @example
 * ```TypeScript
 * // in a GraphQL resolver file
 *
 * \@Transaction()
 * async myMutation(@Ctx() ctx: RequestContext) {
 *   // as long as the `ctx` object is passed in to
 *   // all database operations, the entire mutation
 *   // will be run as an atomic transaction, and rolled
 *   // back if an error is thrown.
 *   const result = this.myService.createThing(ctx);
 *   return this.myService.updateOtherThing(ctx, result.id);
 * }
 * ```
 *
 * @docsCategory request
 * @docsCategory data-access
 */
export const Transaction = (transactionMode: TransactionMode = 'auto') => {
    return applyDecorators(
        SetMetadata(TRANSACTION_MODE_METADATA_KEY, transactionMode),
        UseInterceptors(TransactionInterceptor),
    );
};
