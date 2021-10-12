import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ID, Type } from '@vendure/common/lib/shared-types';
import {
    Connection,
    EntityManager,
    EntitySchema,
    FindOneOptions,
    FindOptionsUtils,
    getRepository,
    ObjectType,
    Repository,
} from 'typeorm';

import { RequestContext } from '../api/common/request-context';
import { TRANSACTION_MANAGER_KEY } from '../common/constants';
import { EntityNotFoundError } from '../common/error/errors';
import { ChannelAware, SoftDeletable } from '../common/types/common-types';
import { VendureEntity } from '../entity/base/base.entity';

import { TransactionWrapper } from './transaction-wrapper';
import { GetEntityOrThrowOptions } from './types';

/**
 * @description
 * The TransactionalConnection is a wrapper around the TypeORM `Connection` object which works in conjunction
 * with the {@link Transaction} decorator to implement per-request transactions. All services which access the
 * database should use this class rather than the raw TypeORM connection, to ensure that db changes can be
 * easily wrapped in transactions when required.
 *
 * The service layer does not need to know about the scope of a transaction, as this is covered at the
 * API by the use of the `Transaction` decorator.
 *
 * @docsCategory data-access
 */
@Injectable()
export class TransactionalConnection {
    constructor(
        @InjectConnection() private connection: Connection,
        private transactionWrapper: TransactionWrapper,
    ) {}

    /**
     * @description
     * The plain TypeORM Connection object. Should be used carefully as any operations
     * performed with this connection will not be performed within any outer
     * transactions.
     */
    get rawConnection(): Connection {
        return this.connection;
    }

    /**
     * @description
     * Returns a TypeORM repository. Note that when no RequestContext is supplied, the repository will not
     * be aware of any existing transaction. Therefore calling this method without supplying a RequestContext
     * is discouraged without a deliberate reason.
     */
    getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Repository<Entity>;
    /**
     * @description
     * Returns a TypeORM repository which is bound to any existing transactions. It is recommended to _always_ pass
     * the RequestContext argument when possible, otherwise the queries will be executed outside of any
     * ongoing transactions which have been started by the {@link Transaction} decorator.
     */
    getRepository<Entity>(
        ctx: RequestContext | undefined,
        target: ObjectType<Entity> | EntitySchema<Entity> | string,
    ): Repository<Entity>;
    getRepository<Entity>(
        ctxOrTarget: RequestContext | ObjectType<Entity> | EntitySchema<Entity> | string | undefined,
        maybeTarget?: ObjectType<Entity> | EntitySchema<Entity> | string,
    ): Repository<Entity> {
        if (ctxOrTarget instanceof RequestContext) {
            const transactionManager = this.getTransactionManager(ctxOrTarget);
            if (transactionManager && maybeTarget && !transactionManager.queryRunner?.isReleased) {
                return transactionManager.getRepository(maybeTarget);
            } else {
                // tslint:disable-next-line:no-non-null-assertion
                return getRepository(maybeTarget!);
            }
        } else {
            // tslint:disable-next-line:no-non-null-assertion
            return getRepository(ctxOrTarget ?? maybeTarget!);
        }
    }

    /**
     * @description
     * Allows database operations to be wrapped in a transaction, ensuring that in the event of an error being
     * thrown at any point, the entire transaction will be rolled back and no changes will be saved.
     *
     * In the context of API requests, you should instead use the {@link Transaction} decorator on your resolver or
     * controller method.
     *
     * On the other hand, for code that does not run in the context of a GraphQL/REST request, this method
     * should be used to protect against non-atomic changes to the data which could leave your data in an
     * inconsistent state.
     *
     * Such situations include function processed by the JobQueue or stand-alone scripts which make use
     * of Vendure internal services.
     *
     * If there is already a {@link RequestContext} object available, you should pass it in as the first
     * argument in order to add a new transaction to it. If not, omit the first argument and an empty
     * RequestContext object will be created, which is then used to propagate the transaction to
     * all inner method calls.
     *
     * @example
     * ```TypeScript
     * private async transferCredit(fromId: ID, toId: ID, amount: number) {
     *   await this.connection.withTransaction(ctx => {
     *     await this.giftCardService.updateCustomerCredit(fromId, -amount);
     *
     *     // If some intermediate logic here throws an Error,
     *     // then all DB transactions will be rolled back and neither Customer's
     *     // credit balance will have changed.
     *
     *     await this.giftCardService.updateCustomerCredit(toId, amount);
     *   })
     * }
     * ```
     *
     * @since 1.3.0
     */
    async withTransaction<T>(work: (ctx: RequestContext) => Promise<T>): Promise<T>;
    async withTransaction<T>(ctx: RequestContext, work: (ctx: RequestContext) => Promise<T>): Promise<T>;
    async withTransaction<T>(
        ctxOrWork: RequestContext | ((ctx: RequestContext) => Promise<T>),
        maybeWork?: (ctx: RequestContext) => Promise<T>,
    ): Promise<T> {
        let ctx: RequestContext;
        let work: (ctx: RequestContext) => Promise<T>;
        if (ctxOrWork instanceof RequestContext) {
            ctx = ctxOrWork;
            // tslint:disable-next-line:no-non-null-assertion
            work = maybeWork!;
        } else {
            ctx = RequestContext.empty();
            work = ctxOrWork;
        }
        return this.transactionWrapper.executeInTransaction(ctx, () => work(ctx), 'auto', this.rawConnection);
    }

    /**
     * @description
     * Manually start a transaction if one is not already in progress. This method should be used in
     * conjunction with the `'manual'` mode of the {@link Transaction} decorator.
     */
    async startTransaction(ctx: RequestContext) {
        const transactionManager = this.getTransactionManager(ctx);
        if (transactionManager?.queryRunner?.isTransactionActive === false) {
            await transactionManager.queryRunner.startTransaction();
        }
    }

    /**
     * @description
     * Manually commits any open transaction. Should be very rarely needed, since the {@link Transaction} decorator
     * and the internal TransactionInterceptor take care of this automatically. Use-cases include situations
     * in which the worker thread needs to access changes made in the current transaction, or when using the
     * Transaction decorator in manual mode.
     */
    async commitOpenTransaction(ctx: RequestContext) {
        const transactionManager = this.getTransactionManager(ctx);
        if (transactionManager?.queryRunner?.isTransactionActive) {
            await transactionManager.queryRunner.commitTransaction();
        }
    }

    /**
     * @description
     * Manually rolls back any open transaction. Should be very rarely needed, since the {@link Transaction} decorator
     * and the internal TransactionInterceptor take care of this automatically. Use-cases include when using the
     * Transaction decorator in manual mode.
     */
    async rollBackTransaction(ctx: RequestContext) {
        const transactionManager = this.getTransactionManager(ctx);
        if (transactionManager?.queryRunner?.isTransactionActive) {
            await transactionManager.queryRunner.rollbackTransaction();
        }
    }

    /**
     * @description
     * Finds an entity of the given type by ID, or throws an `EntityNotFoundError` if none
     * is found.
     */
    async getEntityOrThrow<T extends VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        id: ID,
        options: GetEntityOrThrowOptions<T> = {},
    ): Promise<T> {
        const { retries, retryDelay } = options;
        if (retries == null || retries <= 0) {
            return this.getEntityOrThrowInternal(ctx, entityType, id, options);
        } else {
            let err: any;
            const retriesInt = Math.ceil(retries);
            const delay = Math.ceil(Math.max(retryDelay || 25, 1));
            for (let attempt = 0; attempt < retriesInt; attempt++) {
                try {
                    const result = await this.getEntityOrThrowInternal(ctx, entityType, id, options);
                    return result;
                } catch (e) {
                    err = e;
                    if (attempt < retriesInt - 1) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
            throw err;
        }
    }

    private async getEntityOrThrowInternal<T extends VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        id: ID,
        options: GetEntityOrThrowOptions = {},
    ): Promise<T> {
        let entity: T | undefined;
        if (options.channelId != null) {
            const { channelId, ...optionsWithoutChannelId } = options;
            entity = await this.findOneInChannel(
                ctx,
                entityType as Type<T & ChannelAware>,
                id,
                options.channelId,
                optionsWithoutChannelId,
            );
        } else {
            entity = await this.getRepository(ctx, entityType).findOne(id, options as FindOneOptions);
        }
        if (
            !entity ||
            (entity.hasOwnProperty('deletedAt') &&
                (entity as T & SoftDeletable).deletedAt !== null &&
                options.includeSoftDeleted !== true)
        ) {
            throw new EntityNotFoundError(entityType.name as any, id);
        }
        return entity;
    }

    /**
     * @description
     * Like the TypeOrm `Repository.findOne()` method, but limits the results to
     * the given Channel.
     */
    findOneInChannel<T extends ChannelAware & VendureEntity>(
        ctx: RequestContext,
        entity: Type<T>,
        id: ID,
        channelId: ID,
        options: FindOneOptions = {},
    ) {
        const qb = this.getRepository(ctx, entity).createQueryBuilder('entity');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, options);
        if (options.loadEagerRelations !== false) {
            // tslint:disable-next-line:no-non-null-assertion
            FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        }
        return qb
            .leftJoin('entity.channels', 'channel')
            .andWhere('entity.id = :id', { id })
            .andWhere('channel.id = :channelId', { channelId })
            .getOne();
    }

    /**
     * @description
     * Like the TypeOrm `Repository.findByIds()` method, but limits the results to
     * the given Channel.
     */
    findByIdsInChannel<T extends ChannelAware | VendureEntity>(
        ctx: RequestContext,
        entity: Type<T>,
        ids: ID[],
        channelId: ID,
        options: FindOneOptions,
    ) {
        // the syntax described in https://github.com/typeorm/typeorm/issues/1239#issuecomment-366955628
        // breaks if the array is empty
        if (ids.length === 0) {
            return Promise.resolve([]);
        }

        const qb = this.getRepository(ctx, entity).createQueryBuilder('entity');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, options);
        if (options.loadEagerRelations !== false) {
            // tslint:disable-next-line:no-non-null-assertion
            FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        }
        return qb
            .leftJoin('entity.channels', 'channel')
            .andWhere('entity.id IN (:...ids)', { ids })
            .andWhere('channel.id = :channelId', { channelId })
            .getMany();
    }

    private getTransactionManager(ctx: RequestContext): EntityManager | undefined {
        return (ctx as any)[TRANSACTION_MANAGER_KEY];
    }
}
