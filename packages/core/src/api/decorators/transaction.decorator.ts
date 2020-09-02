import { applyDecorators, UseInterceptors } from '@nestjs/common';

import { TransactionInterceptor } from '../middleware/transaction-interceptor';

/**
 * @description
 * Runs the decorated method in a TypeORM transaction. It works by creating a transctional
 * QueryRunner which gets attached to the RequestContext object. When the RequestContext
 * is the passed to the {@link TransactionalConnection} `getRepository()` method, this
 * QueryRunner is used to execute the queries within this transaction.
 *
 * @docsCategory request
 * @docsPage Decorators
 */
export const Transaction = applyDecorators(UseInterceptors(TransactionInterceptor));
