import { ApolloServerPlugin, GraphQLRequestListener, GraphQLServiceContext } from 'apollo-server-plugin-base';
import { EntityManager } from 'typeorm';

import { REQUEST_CONTEXT_KEY, TRANSACTION_MANAGER_KEY } from '../../common/constants';
import { AssetStorageStrategy } from '../../config/asset-storage-strategy/asset-storage-strategy';
import { TransactionalConnection } from '../../service/transaction/transactional-connection';
import { RequestContext } from '../common/request-context';

/**
 * @description
 * Intercepts outgoing responses to see if there is an open QueryRunner attached to the
 * RequestContext. This is necessary when using the {@link TransactionInterceptor} because
 * it opens a transaction without releasing it.
 *
 * The reason that the `.release()` call is done here, and not in a `finally` block
 * in the TransactionInterceptor is that this plugin runs after _all nested resolvers_
 * have resolved, whereas the Interceptor considers the request complete after only the
 * top-level resolver returns.
 */
export class TransactionPlugin implements ApolloServerPlugin {
    requestDidStart(): GraphQLRequestListener {
        return {
            willSendResponse: async requestContext => {
                const { context } = requestContext;
                const transactionManager: EntityManager | undefined =
                    context.req?.[REQUEST_CONTEXT_KEY]?.[TRANSACTION_MANAGER_KEY];
                if (transactionManager) {
                    const { queryRunner } = transactionManager;
                    if (queryRunner?.isReleased === false) {
                        await queryRunner.release();
                    }
                }
            },
        };
    }
}
