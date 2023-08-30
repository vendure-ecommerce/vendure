import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { LogicalOperator } from '@vendure/common/lib/generated-types';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import {
    Brackets,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    In,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { BetterSqlite3Driver } from 'typeorm/driver/better-sqlite3/BetterSqlite3Driver';
import { SqljsDriver } from 'typeorm/driver/sqljs/SqljsDriver';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { ApiType } from '../../../api/common/get-api-type';
import { RequestContext } from '../../../api/common/request-context';
import { UserInputError } from '../../../common/error/errors';
import { ListQueryOptions, NullOptionals, SortParameter } from '../../../common/types/common-types';
import { ConfigService } from '../../../config/config.service';
import { CustomFields } from '../../../config/custom-field/custom-field-types';
import { Logger } from '../../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { VendureEntity } from '../../../entity/base/base.entity';

import { getColumnMetadata, getEntityAlias } from './connection-utils';
import { getCalculatedColumns } from './get-calculated-columns';
import { parseFilterParams } from './parse-filter-params';
import { parseSortParams } from './parse-sort-params';

/**
 * @description
 * Options which can be passed to the ListQueryBuilder's `build()` method.
 *
 * @docsCategory data-access
 * @docsPage ListQueryBuilder
 */
export type ExtendedListQueryOptions<T extends VendureEntity> = {
    relations?: string[];
    channelId?: ID;
    where?: FindOptionsWhere<T>;
    orderBy?: FindOneOptions<T>['order'];
    /**
     * @description
     * Allows you to specify the alias used for the entity `T` in the generated SQL query.
     * Defaults to the entity class name lower-cased, i.e. `ProductVariant` -> `'productvariant'`.
     *
     * @since 1.6.0
     */
    entityAlias?: string;
    /**
     * @description
     * When a RequestContext is passed, then the query will be
     * executed as part of any outer transaction.
     */
    ctx?: RequestContext;
    /**
     * @description
     * One of the main tasks of the ListQueryBuilder is to auto-generate filter and sort queries based on the
     * available columns of a given entity. However, it may also be sometimes desirable to allow filter/sort
     * on a property of a relation. In this case, the `customPropertyMap` can be used to define a property
     * of the `options.sort` or `options.filter` which does not correspond to a direct column of the current
     * entity, and then provide a mapping to the related property to be sorted/filtered.
     *
     * Example: we want to allow sort/filter by and Order's `customerLastName`. The actual lastName property is
     * not a column in the Order table, it exists on the Customer entity, and Order has a relation to Customer via
     * `Order.customer`. Therefore, we can define a customPropertyMap like this:
     *
     * @example
     * ```GraphQL
     * """
     * Manually extend the filter & sort inputs to include the new
     * field that we want to be able to use in building list queries.
     * """
     * input OrderFilterParameter {
     *     customerLastName: StringOperators
     * }
     *
     * input OrderSortParameter {
     *     customerLastName: SortOrder
     * }
     * ```
     *
     * @example
     * ```ts
     * const qb = this.listQueryBuilder.build(Order, options, {
     *   relations: ['customer'],
     *   customPropertyMap: {
     *     // Tell TypeORM how to map that custom
     *     // sort/filter field to the property on a
     *     // related entity.
     *     customerLastName: 'customer.lastName',
     *   },
     * };
     * ```
     * We can now use the `customerLastName` property to filter or sort
     * on the list query:
     *
     * @example
     * ```GraphQL
     * query {
     *   myOrderQuery(options: {
     *     filter: {
     *       customerLastName: { contains: "sm" }
     *     }
     *   }) {
     *     # ...
     *   }
     * }
     * ```
     */
    customPropertyMap?: { [name: string]: string };
    /**
     * @description
     * When set to `true`, the configured `shopListQueryLimit` and `adminListQueryLimit` values will be ignored,
     * allowing unlimited results to be returned. Use caution when exposing an unlimited list query to the public,
     * as it could become a vector for a denial of service attack if an attacker requests a very large list.
     *
     * @since 2.0.2
     * @default false
     */
    ignoreQueryLimits?: boolean;
};

/**
 * @description
 * This helper class is used when fetching entities the database from queries which return a {@link PaginatedList} type.
 * These queries all follow the same format:
 *
 * In the GraphQL definition, they return a type which implements the `Node` interface, and the query returns a
 * type which implements the `PaginatedList` interface:
 *
 * ```GraphQL
 * type BlogPost implements Node {
 *   id: ID!
 *   published: DateTime!
 *   title: String!
 *   body: String!
 * }
 *
 * type BlogPostList implements PaginatedList {
 *   items: [BlogPost!]!
 *   totalItems: Int!
 * }
 *
 * # Generated at run-time by Vendure
 * input BlogPostListOptions
 *
 * extend type Query {
 *    blogPosts(options: BlogPostListOptions): BlogPostList!
 * }
 * ```
 * When Vendure bootstraps, it will find the `BlogPostListOptions` input and, because it is used in a query
 * returning a `PaginatedList` type, it knows that it should dynamically generate this input. This means
 * all primitive field of the `BlogPost` type (namely, "published", "title" and "body") will have `filter` and
 * `sort` inputs created for them, as well a `skip` and `take` fields for pagination.
 *
 * Your resolver function will then look like this:
 *
 * ```TypeScript
 * \@Resolver()
 * export class BlogPostResolver
 *   constructor(private blogPostService: BlogPostService) {}
 *
 *   \@Query()
 *   async blogPosts(
 *     \@Ctx() ctx: RequestContext,
 *     \@Args() args: any,
 *   ): Promise<PaginatedList<BlogPost>> {
 *     return this.blogPostService.findAll(ctx, args.options || undefined);
 *   }
 * }
 * ```
 *
 * and the corresponding service will use the ListQueryBuilder:
 *
 * ```TypeScript
 * \@Injectable()
 * export class BlogPostService {
 *   constructor(private listQueryBuilder: ListQueryBuilder) {}
 *
 *   findAll(ctx: RequestContext, options?: ListQueryOptions<BlogPost>) {
 *     return this.listQueryBuilder
 *       .build(BlogPost, options)
 *       .getManyAndCount()
 *       .then(async ([items, totalItems]) => {
 *         return { items, totalItems };
 *       });
 *   }
 * }
 * ```
 *
 * @docsCategory data-access
 * @docsPage ListQueryBuilder
 * @docsWeight 0
 */
@Injectable()
export class ListQueryBuilder implements OnApplicationBootstrap {
    constructor(private connection: TransactionalConnection, private configService: ConfigService) {}

    /** @internal */
    onApplicationBootstrap(): any {
        this.registerSQLiteRegexpFunction();
    }

    /**
     * @description
     * Creates and configures a SelectQueryBuilder for queries that return paginated lists of entities.
     */
    build<T extends VendureEntity>(
        entity: Type<T>,
        options: ListQueryOptions<T> = {},
        extendedOptions: ExtendedListQueryOptions<T> = {},
    ): SelectQueryBuilder<T> {
        const apiType = extendedOptions.ctx?.apiType ?? 'shop';
        const rawConnection = this.connection.rawConnection;
        const { take, skip } = this.parseTakeSkipParams(apiType, options, extendedOptions.ignoreQueryLimits);

        const repo = extendedOptions.ctx
            ? this.connection.getRepository(extendedOptions.ctx, entity)
            : this.connection.rawConnection.getRepository(entity);
        const alias = extendedOptions.entityAlias || entity.name.toLowerCase();
        const minimumRequiredRelations = this.getMinimumRequiredRelations(repo, options, extendedOptions);
        const qb = repo.createQueryBuilder(alias).setFindOptions({
            relations: minimumRequiredRelations,
            take,
            skip,
            where: extendedOptions.where || {},
            // We would like to be able to use this feature
            // rather than our custom `optimizeGetManyAndCountMethod()` implementation,
            // but at this time (TypeORM 0.3.12) it throws an error in the case of
            // a Collection that joins its parent entity.
            // relationLoadStrategy: 'query',
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

        // join the tables required by calculated columns
        this.joinCalculatedColumnRelations(qb, entity, options);

        const { customPropertyMap, entityAlias } = extendedOptions;
        if (customPropertyMap) {
            this.normalizeCustomPropertyMap(customPropertyMap, options, qb);
        }
        const customFieldsForType = this.configService.customFields[entity.name as keyof CustomFields];
        const sortParams = Object.assign({}, options.sort, extendedOptions.orderBy);
        this.applyTranslationConditions(qb, entity, sortParams, extendedOptions.ctx, alias);
        const sort = parseSortParams(
            rawConnection,
            entity,
            sortParams,
            customPropertyMap,
            entityAlias,
            customFieldsForType,
        );
        const filter = parseFilterParams(
            rawConnection,
            entity,
            options.filter,
            customPropertyMap,
            entityAlias,
        );

        if (filter.length) {
            const filterOperator = options.filterOperator ?? LogicalOperator.AND;
            if (filterOperator === LogicalOperator.AND) {
                filter.forEach(({ clause, parameters }) => {
                    qb.andWhere(clause, parameters);
                });
            } else {
                qb.andWhere(
                    new Brackets(qb1 => {
                        filter.forEach(({ clause, parameters }) => {
                            qb1.orWhere(clause, parameters);
                        });
                    }),
                );
            }
        }

        if (extendedOptions.channelId) {
            qb.leftJoin(`${alias}.channels`, 'lqb__channel').andWhere('lqb__channel.id = :channelId', {
                channelId: extendedOptions.channelId,
            });
        }

        qb.orderBy(sort);
        this.optimizeGetManyAndCountMethod(qb, repo, extendedOptions, minimumRequiredRelations);
        this.optimizeGetManyMethod(qb, repo, extendedOptions, minimumRequiredRelations);
        return qb;
    }

    private parseTakeSkipParams(
        apiType: ApiType,
        options: ListQueryOptions<any>,
        ignoreQueryLimits = false,
    ): { take: number; skip: number } {
        const { shopListQueryLimit, adminListQueryLimit } = this.configService.apiOptions;
        const takeLimit = ignoreQueryLimits
            ? Number.MAX_SAFE_INTEGER
            : apiType === 'admin'
            ? adminListQueryLimit
            : shopListQueryLimit;
        if (options.take && options.take > takeLimit) {
            throw new UserInputError('error.list-query-limit-exceeded', { limit: takeLimit });
        }
        const rawConnection = this.connection.rawConnection;
        const skip = Math.max(options.skip ?? 0, 0);
        // `take` must not be negative, and must not be greater than takeLimit
        let take = options.take == null ? takeLimit : Math.min(Math.max(options.take, 0), takeLimit);
        if (options.skip !== undefined && options.take === undefined) {
            take = takeLimit;
        }
        return { take, skip };
    }

    /**
     * @description
     * As part of list optimization, we only join the minimum required relations which are needed to
     * get the base list query. Other relations are then joined individually in the patched `getManyAndCount()`
     * method.
     */
    private getMinimumRequiredRelations<T extends VendureEntity>(
        repository: Repository<T>,
        options: ListQueryOptions<T>,
        extendedOptions: ExtendedListQueryOptions<T>,
    ): string[] {
        const requiredRelations: string[] = [];
        if (extendedOptions.channelId) {
            requiredRelations.push('channels');
        }
        if (extendedOptions.customPropertyMap) {
            const metadata = repository.metadata;

            for (const [property, path] of Object.entries(extendedOptions.customPropertyMap)) {
                if (!this.customPropertyIsBeingUsed(property, options)) {
                    // If the custom property is not being used to filter or sort, then we don't need
                    // to join the associated relations.
                    continue;
                }

                // TODO: Delete for v2
                // This is a work-around to allow the use of the legacy table-name-based
                // customPropertyMap syntax
                let relationPathYieldedMatch = false;

                const relationPath = path.split('.').slice(0, -1);
                let targetMetadata = metadata;
                const recontructedPath = [];
                for (const relationPathPart of relationPath) {
                    const relationMetadata = targetMetadata.findRelationWithPropertyPath(relationPathPart);
                    if (relationMetadata) {
                        recontructedPath.push(relationMetadata.propertyName);
                        requiredRelations.push(recontructedPath.join('.'));
                        targetMetadata = relationMetadata.inverseEntityMetadata;
                        relationPathYieldedMatch = true;
                    }
                }

                if (!relationPathYieldedMatch) {
                    // TODO: Delete this in v2.
                    // Legacy behaviour that uses the table name to reference relations.
                    // This causes a bunch of issues and is also a bad, unintuitive way to
                    // reference relations. See https://github.com/vendure-ecommerce/vendure/issues/1774
                    const tableNameLower = path.split('.')[0];
                    const entityMetadata = repository.manager.connection.entityMetadatas.find(
                        em => em.tableNameWithoutPrefix === tableNameLower,
                    );
                    if (entityMetadata) {
                        const relationMetadata = metadata.relations.find(
                            r => r.type === entityMetadata.target,
                        );
                        if (relationMetadata) {
                            requiredRelations.push(relationMetadata.propertyName);
                        }
                    }
                }
            }
        }
        return unique(requiredRelations);
    }

    private customPropertyIsBeingUsed(property: string, options: ListQueryOptions<any>): boolean {
        return !!(options.sort?.[property] || options.filter?.[property]);
    }

    /**
     * @description
     * This will monkey-patch the `getManyAndCount()` method in order to implement a more efficient
     * parallel-query based approach to joining multiple relations. This is loosely based on the
     * solution outlined here: https://github.com/typeorm/typeorm/issues/3857#issuecomment-633006643
     *
     * TODO: When upgrading to TypeORM v0.3+, this will likely become redundant due to the new
     * `relationLoadStrategy` feature.
     */
    private optimizeGetManyAndCountMethod<T extends VendureEntity>(
        qb: SelectQueryBuilder<T>,
        repo: Repository<T>,
        extendedOptions: ExtendedListQueryOptions<T>,
        alreadyJoined: string[],
    ) {
        const originalGetManyAndCount = qb.getManyAndCount.bind(qb);
        qb.getManyAndCount = async () => {
            const relations = unique(extendedOptions.relations ?? []);
            const [entities, count] = await originalGetManyAndCount();
            if (relations == null || alreadyJoined.sort().join() === relations?.sort().join()) {
                // No further relations need to be joined, so we just
                // return the regular result.
                return [entities, count];
            }
            const result = await this.parallelLoadRelations(entities, relations, alreadyJoined, repo);
            return [result, count];
        };
    }
    /**
     * @description
     * This will monkey-patch the `getMany()` method in order to implement a more efficient
     * parallel-query based approach to joining multiple relations. This is loosely based on the
     * solution outlined here: https://github.com/typeorm/typeorm/issues/3857#issuecomment-633006643
     *
     * TODO: When upgrading to TypeORM v0.3+, this will likely become redundant due to the new
     * `relationLoadStrategy` feature.
     */
    private optimizeGetManyMethod<T extends VendureEntity>(
        qb: SelectQueryBuilder<T>,
        repo: Repository<T>,
        extendedOptions: ExtendedListQueryOptions<T>,
        alreadyJoined: string[],
    ) {
        const originalGetMany = qb.getMany.bind(qb);
        qb.getMany = async () => {
            const relations = unique(extendedOptions.relations ?? []);
            const entities = await originalGetMany();
            if (relations == null || alreadyJoined.sort().join() === relations?.sort().join()) {
                // No further relations need to be joined, so we just
                // return the regular result.
                return entities;
            }
            return this.parallelLoadRelations(entities, relations, alreadyJoined, repo);
        };
    }

    private async parallelLoadRelations<T extends VendureEntity>(
        entities: T[],
        relations: string[],
        alreadyJoined: string[],
        repo: Repository<T>,
    ): Promise<T[]> {
        const entityMap = new Map(entities.map(e => [e.id, e]));
        const entitiesIds = entities.map(({ id }) => id);

        const splitRelations = relations
            .map(r => r.split('.'))
            .filter(path => {
                // There is an issue in TypeORM currently which causes
                // an error when trying to join nested relations inside
                // customFields. See https://github.com/vendure-ecommerce/vendure/issues/1664
                // The work-around is to omit them and rely on the GraphQL resolver
                // layer to handle.
                if (path[0] === 'customFields' && 2 < path.length) {
                    return false;
                }
                return true;
            });
        const groupedRelationsMap = new Map<string, string[]>();

        for (const relationParts of splitRelations) {
            const group = groupedRelationsMap.get(relationParts[0]);
            if (group) {
                group.push(relationParts.join('.'));
            } else {
                groupedRelationsMap.set(relationParts[0], [relationParts.join('.')]);
            }
        }

        // If the extendedOptions includes relations that were already joined, then
        // we ignore those now so as not to do the work of joining twice.
        for (const tableName of alreadyJoined) {
            if (groupedRelationsMap.get(tableName)?.length === 1) {
                groupedRelationsMap.delete(tableName);
            }
        }

        const entitiesIdsWithRelations = await Promise.all(
            Array.from(groupedRelationsMap.values())?.map(relationPaths => {
                return repo
                    .find({
                        where: { id: In(entitiesIds) },
                        select: ['id'],
                        relations: relationPaths,
                        loadEagerRelations: true,
                    } as FindManyOptions<T>)
                    .then(results =>
                        results.map(r => ({ relation: relationPaths[0] as keyof T, entity: r })),
                    );
            }),
        ).then(all => all.flat());
        for (const entry of entitiesIdsWithRelations) {
            const finalEntity = entityMap.get(entry.entity.id);
            if (finalEntity) {
                this.assignDeep(entry.relation, entry.entity, finalEntity);
            }
        }
        return Array.from(entityMap.values());
    }

    private assignDeep<T>(relation: string | keyof T, source: T, target: T) {
        if (typeof relation === 'string') {
            const parts = relation.split('.');
            let resolvedTarget: any = target;
            let resolvedSource: any = source;

            for (const part of parts.slice(0, parts.length - 1)) {
                if (!resolvedTarget[part]) {
                    resolvedTarget[part] = {};
                }
                if (!resolvedSource[part]) {
                    return;
                }
                resolvedTarget = resolvedTarget[part];
                resolvedSource = resolvedSource[part];
            }

            resolvedTarget[parts[parts.length - 1]] = resolvedSource[parts[parts.length - 1]];
        } else {
            target[relation] = source[relation];
        }
    }

    /**
     * If a customPropertyMap is provided, we need to take the path provided and convert it to the actual
     * relation aliases being used by the SelectQueryBuilder.
     *
     * This method mutates the customPropertyMap object.
     */
    private normalizeCustomPropertyMap(
        customPropertyMap: { [name: string]: string },
        options: ListQueryOptions<any>,
        qb: SelectQueryBuilder<any>,
    ) {
        for (const [property, value] of Object.entries(customPropertyMap)) {
            if (!this.customPropertyIsBeingUsed(property, options)) {
                continue;
            }
            const parts = customPropertyMap[property].split('.');
            const entityPart = 2 <= parts.length ? parts[parts.length - 2] : qb.alias;
            const columnPart = parts[parts.length - 1];

            const relationMetadata =
                qb.expressionMap.mainAlias?.metadata.findRelationWithPropertyPath(entityPart);
            const relationAlias =
                qb.expressionMap.aliases.find(a => a.metadata.tableNameWithoutPrefix === entityPart) ??
                qb.expressionMap.joinAttributes.find(ja => ja.relationCache === relationMetadata)?.alias;
            if (relationAlias) {
                customPropertyMap[property] = `${relationAlias.name}.${columnPart}`;
            } else {
                Logger.error(
                    `The customPropertyMap entry "${property}:${value}" could not be resolved to a related table`,
                );
                delete customPropertyMap[property];
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
     * @description
     * If this entity is Translatable, and we are sorting on one of the translatable fields,
     * then we need to apply appropriate WHERE clauses to limit
     * the joined translation relations.
     */
    private applyTranslationConditions<T extends VendureEntity>(
        qb: SelectQueryBuilder<any>,
        entity: Type<T>,
        sortParams: NullOptionals<SortParameter<T>> & FindOneOptions<T>['order'],
        ctx?: RequestContext,
        entityAlias?: string,
    ) {
        const languageCode = ctx?.languageCode || this.configService.defaultLanguageCode;

        const {
            columns,
            translationColumns,
            alias: defaultAlias,
        } = getColumnMetadata(this.connection.rawConnection, entity);
        const alias = entityAlias ?? defaultAlias;

        const sortKeys = Object.keys(sortParams);
        let sortingOnTranslatableKey = false;
        for (const translationColumn of translationColumns) {
            if (sortKeys.includes(translationColumn.propertyName)) {
                sortingOnTranslatableKey = true;
            }
        }

        if (translationColumns.length && sortingOnTranslatableKey) {
            const translationsAlias = qb.connection.namingStrategy.eagerJoinRelationAlias(
                alias,
                'translations',
            );

            qb.andWhere(
                new Brackets(qb1 => {
                    qb1.where(`${translationsAlias}.languageCode = :languageCode`, { languageCode });
                    const defaultLanguageCode =
                        ctx?.channel.defaultLanguageCode ?? this.configService.defaultLanguageCode;
                    const translationEntity = translationColumns[0].entityMetadata.target;
                    if (languageCode !== defaultLanguageCode) {
                        // If the current languageCode is not the default, then we create a more
                        // complex WHERE clause to allow us to use the non-default translations and
                        // fall back to the default language if no translation exists.
                        qb1.orWhere(
                            new Brackets(qb2 => {
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
                        defaultLanguageCode,
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
