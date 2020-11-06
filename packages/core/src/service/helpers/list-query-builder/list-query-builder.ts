import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { FindConditions, FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { BetterSqlite3Driver } from 'typeorm/driver/better-sqlite3/BetterSqlite3Driver';
import { SqljsDriver } from 'typeorm/driver/sqljs/SqljsDriver';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { RequestContext } from '../../../api/common/request-context';
import { ListQueryOptions } from '../../../common/types/common-types';
import { VendureEntity } from '../../../entity/base/base.entity';
import { TransactionalConnection } from '../../transaction/transactional-connection';

import { parseChannelParam } from './parse-channel-param';
import { parseFilterParams } from './parse-filter-params';
import { parseSortParams } from './parse-sort-params';

export type ExtendedListQueryOptions<T extends VendureEntity> = {
    relations?: string[];
    channelId?: ID;
    where?: FindConditions<T>;
    orderBy?: FindOneOptions<T>['order'];
    /**
     * When a RequestContext is passed, then the query will be
     * executed as part of any outer transaction.
     */
    ctx?: RequestContext;
};

@Injectable()
export class ListQueryBuilder implements OnApplicationBootstrap {
    constructor(private connection: TransactionalConnection) {}

    onApplicationBootstrap(): any {
        this.registerSQLiteRegexpFunction();
    }

    /**
     * Creates and configures a SelectQueryBuilder for queries that return paginated lists of entities.
     */
    build<T extends VendureEntity>(
        entity: Type<T>,
        options: ListQueryOptions<T> = {},
        extendedOptions: ExtendedListQueryOptions<T> = {},
    ): SelectQueryBuilder<T> {
        const skip = options.skip;
        const rawConnection = this.connection.rawConnection;
        let take = options.take;
        if (options.skip !== undefined && options.take === undefined) {
            take = Number.MAX_SAFE_INTEGER;
        }
        const sort = parseSortParams(
            rawConnection,
            entity,
            Object.assign({}, options.sort, extendedOptions.orderBy),
        );
        const filter = parseFilterParams(rawConnection, entity, options.filter);

        const repo = extendedOptions.ctx
            ? this.connection.getRepository(extendedOptions.ctx, entity)
            : this.connection.getRepository(entity);
        const qb = repo.createQueryBuilder(entity.name.toLowerCase());
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: extendedOptions.relations,
            take,
            skip,
            where: extendedOptions.where || {},
        } as FindManyOptions<T>);
        // tslint:disable-next-line:no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

        filter.forEach(({ clause, parameters }) => {
            qb.andWhere(clause, parameters);
        });

        if (extendedOptions.channelId) {
            const channelFilter = parseChannelParam(rawConnection, entity, extendedOptions.channelId);
            if (channelFilter) {
                qb.andWhere(channelFilter.clause, channelFilter.parameters);
            }
        }

        return qb.orderBy(sort);
    }

    /**
     * Registers a user-defined function (for flavors of SQLite driver that support it)
     * so that we can run regex filters on string fields.
     */
    private registerSQLiteRegexpFunction() {
        const regexpFn = (pattern: string, value: string) => {
            const result = new RegExp(`${pattern}`, 'i').test(value);
            return result ? 1 : 0;
        };
        const dbType = this.connection.rawConnection.options.type;
        if (dbType === 'better-sqlite3') {
            const driver = this.connection.rawConnection.driver as BetterSqlite3Driver;
            driver.databaseConnection.function('regexp', regexpFn);
        }
        if (dbType === 'sqljs') {
            const driver = this.connection.rawConnection.driver as SqljsDriver;
            driver.databaseConnection.create_function('regexp', regexpFn);
        }
    }
}
