import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ID, Type } from '@vendure/common/lib/shared-types';
import {
    Connection,
    EntityManager,
    EntitySchema,
    FindManyOptions,
    FindOneOptions,
    FindOptionsUtils,
    getRepository,
    ObjectType,
    Repository,
} from 'typeorm';
import { RepositoryFactory } from 'typeorm/repository/RepositoryFactory';

import { RequestContext } from '../../api/common/request-context';
import { TRANSACTION_MANAGER_KEY } from '../../common/constants';
import { EntityNotFoundError } from '../../common/error/errors';
import { ChannelAware, SoftDeletable } from '../../common/types/common-types';
import { VendureEntity } from '../../entity/base/base.entity';

export interface FindEntityOptions extends FindOneOptions {
    channelId?: ID;
}

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
    constructor(@InjectConnection() private connection: Connection) {}

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
            const transactionManager = (ctxOrTarget as any)[TRANSACTION_MANAGER_KEY];
            if (transactionManager && maybeTarget) {
                const metadata = this.connection.getMetadata(maybeTarget);
                return new RepositoryFactory().create(transactionManager, metadata);
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
     * Manually commits any open transaction. Should be very rarely needed, since the {@link Transaction} decorator
     * and the {@link TransactionInterceptor} take care of this automatically. Use-cases include situations
     * in which the worker thread needs to access changes made in the current transaction.
     */
    async commitOpenTransaction(ctx: RequestContext) {
        const transactionManager: EntityManager = (ctx as any)[TRANSACTION_MANAGER_KEY];
        if (transactionManager.queryRunner?.isTransactionActive) {
            await transactionManager.queryRunner.commitTransaction();
        }
    }

    async getEntityOrThrow<T extends VendureEntity>(
        ctx: RequestContext,
        entityType: Type<T>,
        id: ID,
        options: FindEntityOptions = {},
    ): Promise<T> {
        let entity: T | undefined;
        if (options.channelId != null) {
            entity = await this.findOneInChannel(ctx, entityType, id, options.channelId, options);
        } else {
            entity = await this.getRepository(ctx, entityType).findOne(id, options as FindOneOptions);
        }
        if (
            !entity ||
            (entity.hasOwnProperty('deletedAt') && (entity as T & SoftDeletable).deletedAt !== null)
        ) {
            throw new EntityNotFoundError(entityType.name as any, id);
        }
        return entity;
    }

    /**
     * Like the TypeOrm `Repository.findOne()` method, but limits the results to
     * the given Channel.
     */
    findOneInChannel<T extends ChannelAware | VendureEntity>(
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
        if (options.loadEagerRelations) {
            // tslint:disable-next-line:no-non-null-assertion
            FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);
        }
        return qb
            .leftJoin('entity.channels', 'channel')
            .andWhere('entity.id IN (:...ids)', { ids })
            .andWhere('channel.id = :channelId', { channelId })
            .getMany();
    }
}
