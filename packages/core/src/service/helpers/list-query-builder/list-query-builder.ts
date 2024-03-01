import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { LogicalOperator } from '@vendure/common/lib/generated-types';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import {
    Brackets,
    FindOneOptions,
    FindOptionsWhere,
    getMetadataArgsStorage,
    Repository,
    SelectQueryBuilder,
    WhereExpressionBuilder,
} from 'typeorm';
import { BetterSqlite3Driver } from 'typeorm/driver/better-sqlite3/BetterSqlite3Driver';
import { SqljsDriver } from 'typeorm/driver/sqljs/SqljsDriver';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { ApiType, RequestContext } from '../../../api';
import {
    FilterParameter,
    ListQueryOptions,
    NullOptionals,
    SortParameter,
    UserInputError,
} from '../../../common';
import { ConfigService, CustomFields, Logger } from '../../../config';
import { TransactionalConnection } from '../../../connection';
import { VendureEntity } from '../../../entity';

import { getColumnMetadata, getEntityAlias } from './connection-utils';
import { getCalculatedColumns } from './get-calculated-columns';
import { parseFilterParams, WhereGroup } from './parse-filter-params';
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
 * ```ts
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
 * ```ts
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
     * Used to determine whether a list query `filter` object contains the
     * given property, either at the top level or nested inside a boolean
     * `_and` or `_or` expression.
     *
     * This is useful when a custom property map is used to map a filter
     * field to a related entity, and we need to determine whether the
     * filter object contains that property, which then means we would need
     * to join that relation.
     */
    filterObjectHasProperty<FP extends FilterParameter<VendureEntity>>(
        filterObject: FP | NullOptionals<FP> | null | undefined,
        property: keyof FP,
    ): boolean {
        if (!filterObject) {
            return false;
        }
        for (const key in filterObject) {
            if (!filterObject[key]) {
                continue;
            }
            if (key === property) {
                return true;
            }
            if (key === '_and' || key === '_or') {
                const value = filterObject[key] as FP[];
                for (const condition of value) {
                    if (this.filterObjectHasProperty(condition, property)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /*
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
        const alias = (extendedOptions.entityAlias || entity.name).toLowerCase();
        const minimumRequiredRelations = this.getMinimumRequiredRelations(repo, options, extendedOptions);
        const qb = repo.createQueryBuilder(alias);
        let relations = unique([...minimumRequiredRelations, ...(extendedOptions?.relations ?? [])]);

        if (alias === 'collection' && (relations.includes('parent') || relations.includes('children'))) {
            for (const relation of relations) {
                if (relation !== 'parent' && relation !== 'children') {
                    continue;
                }
                const relationIsAlreadyJoined = qb.expressionMap.joinAttributes.find(
                    ja => ja.entityOrProperty === `${alias}.${relation}`,
                );
                if (!relationIsAlreadyJoined) {
                    const propertyPath = relation.includes('.') ? relation : `${alias}.${relation}`;
                    const relationAlias = relation.includes('.')
                        ? relation.split('.').reverse()[0]
                        : relation;
                    qb.leftJoinAndSelect(propertyPath, `${alias}_${relationAlias}`);
                    qb.leftJoinAndSelect(
                        `${alias}_${relationAlias}.translations`,
                        `${alias}_${relationAlias}_translations`,
                    );
                }
            }
            relations = relations.filter(relation => relation !== 'parent' && relation !== 'children');
        }

        qb.setFindOptions({
            relations,
            take,
            skip,
            where: extendedOptions.where || {},
            relationLoadStrategy: 'query',
        });

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
            qb.andWhere(
                new Brackets(qb1 => {
                    for (const condition of filter) {
                        if ('conditions' in condition) {
                            this.addNestedWhereClause(qb1, condition, filterOperator);
                        } else {
                            if (filterOperator === LogicalOperator.AND) {
                                qb1.andWhere(condition.clause, condition.parameters);
                            } else {
                                qb1.orWhere(condition.clause, condition.parameters);
                            }
                        }
                    }
                }),
            );
        }

        if (extendedOptions.channelId) {
            qb.innerJoin(`${alias}.channels`, 'lqb__channel', 'lqb__channel.id = :channelId', {
                channelId: extendedOptions.channelId,
            });
        }

        qb.orderBy(sort);
        return qb;
    }

    private addNestedWhereClause(
        qb: WhereExpressionBuilder,
        whereGroup: WhereGroup,
        parentOperator: LogicalOperator,
    ) {
        if (whereGroup.conditions.length) {
            const subQb = new Brackets(qb1 => {
                whereGroup.conditions.forEach(condition => {
                    if ('conditions' in condition) {
                        this.addNestedWhereClause(qb1, condition, whereGroup.operator);
                    } else {
                        if (whereGroup.operator === LogicalOperator.AND) {
                            qb1.andWhere(condition.clause, condition.parameters);
                        } else {
                            qb1.orWhere(condition.clause, condition.parameters);
                        }
                    }
                });
            });
            if (parentOperator === LogicalOperator.AND) {
                qb.andWhere(subQb);
            } else {
                qb.orWhere(subQb);
            }
        }
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
                const relationPath = path.split('.').slice(0, -1);
                let targetMetadata = metadata;
                const recontructedPath = [];
                for (const relationPathPart of relationPath) {
                    const relationMetadata = targetMetadata.findRelationWithPropertyPath(relationPathPart);
                    if (relationMetadata) {
                        recontructedPath.push(relationMetadata.propertyName);
                        requiredRelations.push(recontructedPath.join('.'));
                        targetMetadata = relationMetadata.inverseEntityMetadata;
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

            if (!relationMetadata?.propertyName) {
                Logger.error(
                    `The customPropertyMap entry "${property}:${value}" could not be resolved to a related table`,
                );
                delete customPropertyMap[property];
                return;
            }

            customPropertyMap[property] = `${relationMetadata.propertyName}.${columnPart}`;
            qb.leftJoinAndSelect(
                `${qb.alias}.${relationMetadata.propertyName}`,
                relationMetadata.propertyName,
            );
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
            const translationsAlias = qb.connection.namingStrategy.joinTableName(
                alias,
                'translations',
                '',
                '',
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
