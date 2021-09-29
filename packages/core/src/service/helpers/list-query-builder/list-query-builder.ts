import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Brackets, FindConditions, FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { BetterSqlite3Driver } from 'typeorm/driver/better-sqlite3/BetterSqlite3Driver';
import { SqljsDriver } from 'typeorm/driver/sqljs/SqljsDriver';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { ApiType } from '../../../api/common/get-api-type';
import { RequestContext } from '../../../api/common/request-context';
import { UserInputError } from '../../../common/error/errors';
import { ListQueryOptions } from '../../../common/types/common-types';
import { ConfigService } from '../../../config/config.service';
import { Logger } from '../../../config/logger/vendure-logger';
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
    /**
     * One of the main tasks of the ListQueryBuilder is to auto-generate filter and sort queries based on the
     * available columns of a given entity. However, it may also be sometimes desirable to allow filter/sort
     * on a property of a relation. In this case, the `customPropertyMap` can be used to define a property
     * of the `options.sort` or `options.filter` which does not correspond to a direct column of the current
     * entity, and then provide a mapping to the related property to be sorted/filtered.
     *
     * Example: we want to allow sort/filter by and Order's `customerLastName`. The actual lastName property is
     * not a column in the Order table, it exists on the Customer entity, and Order has a relation to Customer via
     * `Order.customer`. Therefore we can define a customPropertyMap like this:
     *
     * ```ts
     * const qb = this.listQueryBuilder.build(Order, options, {
     *   relations: ['customer'],
     *   customPropertyMap: {
     *       customerLastName: 'customer.lastName',
     *   },
     * };
     * ```
     */
    customPropertyMap?: { [name: string]: string };
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
        const apiType = extendedOptions.ctx?.apiType ?? 'shop';
        const rawConnection = this.connection.rawConnection;
        const { take, skip } = this.parseTakeSkipParams(apiType, options);

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

        const { customPropertyMap } = extendedOptions;
        if (customPropertyMap) {
            this.normalizeCustomPropertyMap(customPropertyMap, qb);
        }
        const sort = parseSortParams(
            rawConnection,
            entity,
            Object.assign({}, options.sort, extendedOptions.orderBy),
            customPropertyMap,
        );
        const filter = parseFilterParams(rawConnection, entity, options.filter, customPropertyMap);

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

    private parseTakeSkipParams(
        apiType: ApiType,
        options: ListQueryOptions<any>,
    ): { take: number; skip: number } {
        const { shopListQueryLimit, adminListQueryLimit } = this.configService.apiOptions;
        const takeLimit = apiType === 'admin' ? adminListQueryLimit : shopListQueryLimit;
        if (options.take && options.take > takeLimit) {
            throw new UserInputError('error.list-query-limit-exceeded', { limit: takeLimit });
        }
        const rawConnection = this.connection.rawConnection;
        const skip = Math.max(options.skip ?? 0, 0);
        // `take` must not be negative, and must not be greater than takeLimit
        let take = Math.min(Math.max(options.take ?? 0, 0), takeLimit) || takeLimit;
        if (options.skip !== undefined && options.take === undefined) {
            take = takeLimit;
        }
        return { take, skip };
    }

    /**
     * If a customPropertyMap is provided, we need to take the path provided and convert it to the actual
     * relation aliases being used by the SelectQueryBuilder.
     *
     * This method mutates the customPropertyMap object.
     */
    private normalizeCustomPropertyMap(
        customPropertyMap: { [name: string]: string },
        qb: SelectQueryBuilder<any>,
    ) {
        for (const [key, value] of Object.entries(customPropertyMap)) {
            const parts = customPropertyMap[key].split('.');
            const entityPart = 2 <= parts.length ? parts[parts.length - 2] : qb.alias;
            const columnPart = parts[parts.length - 1];
            const relationAlias = qb.expressionMap.aliases.find(
                a => a.metadata.tableNameWithoutPrefix === entityPart,
            );
            if (relationAlias) {
                customPropertyMap[key] = `${relationAlias.name}.${columnPart}`;
            } else {
                Logger.error(
                    `The customPropertyMap entry "${key}:${value}" could not be resolved to a related table`,
                );
                delete customPropertyMap[key];
            }
        }
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

            qb.andWhere(
                new Brackets(qb1 => {
                    qb1.where(`${translationsAlias}.languageCode = :languageCode`, { languageCode });

                    if (languageCode !== this.configService.defaultLanguageCode) {
                        // If the current languageCode is not the default, then we create a more
                        // complex WHERE clause to allow us to use the non-default translations and
                        // fall back to the default language if no translation exists.
                        qb1.orWhere(
                            new Brackets(qb2 => {
                                const translationEntity = translationColumns[0].entityMetadata.target;
                                const subQb1 = this.connection.rawConnection
                                    .createQueryBuilder(translationEntity, 'translation')
                                    .where(`translation.base = ${alias}.id`)
                                    .andWhere('translation.languageCode = :defaultLanguageCode');
                                const subQb2 = this.connection.rawConnection
                                    .createQueryBuilder(translationEntity, 'translation')
                                    .where(`translation.base = ${alias}.id`)
                                    .andWhere('translation.languageCode = :nonDefaultLanguageCode');

                                qb2.where(`EXISTS (${subQb1.getQuery()})`).andWhere(
                                    `NOT EXISTS (${subQb2.getQuery()})`,
                                );
                            }),
                        );
                    } else {
                        qb1.orWhere(
                            new Brackets(qb2 => {
                                const translationEntity = translationColumns[0].entityMetadata.target;
                                const subQb1 = this.connection.rawConnection
                                    .createQueryBuilder(translationEntity, 'translation')
                                    .where(`translation.base = ${alias}.id`)
                                    .andWhere('translation.languageCode = :defaultLanguageCode');
                                const subQb2 = this.connection.rawConnection
                                    .createQueryBuilder(translationEntity, 'translation')
                                    .where(`translation.base = ${alias}.id`)
                                    .andWhere('translation.languageCode != :defaultLanguageCode');

                                qb2.where(`NOT EXISTS (${subQb1.getQuery()})`).andWhere(
                                    `EXISTS (${subQb2.getQuery()})`,
                                );
                            }),
                        );
                    }
                    qb.setParameters({
                        nonDefaultLanguageCode: languageCode,
                        defaultLanguageCode: this.configService.defaultLanguageCode,
                    });
                }),
            );
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
