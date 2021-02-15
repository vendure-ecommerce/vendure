import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Brackets, FindConditions, FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { BetterSqlite3Driver } from 'typeorm/driver/better-sqlite3/BetterSqlite3Driver';
import { SqljsDriver } from 'typeorm/driver/sqljs/SqljsDriver';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { RequestContext } from '../../../api/common/request-context';
import { ListQueryOptions } from '../../../common/types/common-types';
import { ConfigService } from '../../../config/config.service';
import { VendureEntity } from '../../../entity/base/base.entity';
import { TransactionalConnection } from '../../transaction/transactional-connection';

import { getColumnMetadata, getEntityAlias } from './connection-utils';
import { getCalculatedColumns } from './get-calculated-columns';
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
    constructor(private connection: TransactionalConnection, private configService: ConfigService) {}

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
        const rawConnection = this.connection.rawConnection;
        const skip = Math.max(options.skip ?? 0, 0);
        let take = Math.max(options.take ?? 0, 0);
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

        this.applyTranslationConditions(qb, entity, extendedOptions.ctx);

        // join the tables required by calculated columns
        this.joinCalculatedColumnRelations(qb, entity, options);

        filter.forEach(({ clause, parameters }) => {
            qb.andWhere(clause, parameters);
        });

        if (extendedOptions.channelId) {
            const channelFilter = parseChannelParam(rawConnection, entity, extendedOptions.channelId);
            if (channelFilter) {
                qb.andWhere(channelFilter.clause, channelFilter.parameters);
            }
        }

        qb.orderBy(sort);
        return qb;
    }

    /**
     * Some calculated columns (those with the `@Calculated()` decorator) require extra joins in order
     * to derive the data needed for their expressions.
     */
    private joinCalculatedColumnRelations<T extends VendureEntity>(
        qb: SelectQueryBuilder<T>,
        entity: Type<T>,
        options: ListQueryOptions<T>,
    ) {
        const calculatedColumns = getCalculatedColumns(entity);
        const filterAndSortFields = unique([
            ...Object.keys(options.filter || {}),
            ...Object.keys(options.sort || {}),
        ]);
        const alias = getEntityAlias(this.connection.rawConnection, entity);
        for (const field of filterAndSortFields) {
            const calculatedColumnDef = calculatedColumns.find(c => c.name === field);
            const instruction = calculatedColumnDef?.listQuery;
            if (instruction) {
                const relations = instruction.relations || [];
                for (const relation of relations) {
                    const relationIsAlreadyJoined = qb.expressionMap.joinAttributes.find(
                        ja => ja.entityOrProperty === `${alias}.${relation}`,
                    );
                    if (!relationIsAlreadyJoined) {
                        const propertyPath = relation.includes('.') ? relation : `${alias}.${relation}`;
                        const relationAlias = relation.includes('.')
                            ? relation.split('.').reverse()[0]
                            : relation;
                        qb.innerJoinAndSelect(propertyPath, relationAlias);
                    }
                }
                if (typeof instruction.query === 'function') {
                    instruction.query(qb);
                }
            }
        }
    }

    /**
     * If this entity is Translatable, then we need to apply appropriate WHERE clauses to limit
     * the joined translation relations. This method applies a simple "WHERE" on the languageCode
     * in the case of the default language, otherwise we use a more complex.
     */
    private applyTranslationConditions<T extends VendureEntity>(
        qb: SelectQueryBuilder<any>,
        entity: Type<T>,
        ctx?: RequestContext,
    ) {
        const languageCode = ctx?.languageCode || this.configService.defaultLanguageCode;

        const { columns, translationColumns, alias } = getColumnMetadata(
            this.connection.rawConnection,
            entity,
        );

        if (translationColumns.length) {
            const translationsAlias = qb.connection.namingStrategy.eagerJoinRelationAlias(
                alias,
                'translations',
            );

            qb.andWhere(`${translationsAlias}.languageCode = :languageCode`, { languageCode });

            if (languageCode !== this.configService.defaultLanguageCode) {
                // If the current languageCode is not the default, then we create a more
                // complex WHERE clause to allow us to use the non-default translations and
                // fall back to the default language if no translation exists.
                qb.orWhere(
                    new Brackets(qb1 => {
                        const translationEntity = translationColumns[0].entityMetadata.target;
                        const subQb1 = this.connection.rawConnection
                            .createQueryBuilder(translationEntity, 'translation')
                            .where(`translation.base = ${alias}.id`)
                            .andWhere('translation.languageCode = :defaultLanguageCode');
                        const subQb2 = this.connection.rawConnection
                            .createQueryBuilder(translationEntity, 'translation')
                            .where(`translation.base = ${alias}.id`)
                            .andWhere('translation.languageCode = :nonDefaultLanguageCode');

                        qb1.where(`EXISTS (${subQb1.getQuery()})`).andWhere(
                            `NOT EXISTS (${subQb2.getQuery()})`,
                        );
                    }),
                );
                qb.setParameters({
                    nonDefaultLanguageCode: languageCode,
                    defaultLanguageCode: this.configService.defaultLanguageCode,
                });
            }
        }
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
