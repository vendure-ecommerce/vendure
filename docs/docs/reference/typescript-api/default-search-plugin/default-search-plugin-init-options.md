---
title: "DefaultSearchPluginInitOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultSearchPluginInitOptions

<GenerationInfo sourceFile="packages/core/src/plugin/default-search-plugin/types.ts" sourceLine="15" packageName="@vendure/core" />

Options which configure the behaviour of the DefaultSearchPlugin

```ts title="Signature"
interface DefaultSearchPluginInitOptions {
    indexStockStatus?: boolean;
    bufferUpdates?: boolean;
    searchStrategy?: SearchStrategy;
}
```

<div className="members-wrapper">

### indexStockStatus

<MemberInfo kind="property" type={`boolean`} default={`false.`}   />

If set to `true`, the stock status of a ProductVariant (inStock: Boolean) will
be exposed in the `search` query results. Enabling this option on an existing
Vendure installation will require a DB migration/synchronization.
### bufferUpdates

<MemberInfo kind="property" type={`boolean`} default={`false`}  since="1.3.0"  />

If set to `true`, updates to Products, ProductVariants and Collections will not immediately
trigger an update to the search index. Instead, all these changes will be buffered and will
only be run via a call to the `runPendingSearchIndexUpdates` mutation in the Admin API.

This is very useful for installations with a large number of ProductVariants and/or
Collections, as the buffering allows better control over when these expensive jobs are run,
and also performs optimizations to minimize the amount of work that needs to be performed by
the worker.
### searchStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/default-search-plugin/search-strategy#searchstrategy'>SearchStrategy</a>`} default={`undefined`}  since="1.6.0"  />

Set a custom search strategy that implements <a href='/reference/typescript-api/default-search-plugin/search-strategy#searchstrategy'>SearchStrategy</a> or extends an existing search strategy
such as <a href='/reference/typescript-api/default-search-plugin/mysql-search-strategy#mysqlsearchstrategy'>MysqlSearchStrategy</a>, <a href='/reference/typescript-api/default-search-plugin/postgres-search-strategy#postgressearchstrategy'>PostgresSearchStrategy</a> or <a href='/reference/typescript-api/default-search-plugin/sqlite-search-strategy#sqlitesearchstrategy'>SqliteSearchStrategy</a>.

*Example*

```ts
export class MySearchStrategy implements SearchStrategy {
    private readonly minTermLength = 2;
    private connection: TransactionalConnection;
    private options: DefaultSearchPluginInitOptions;

    async init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.options = injector.get(PLUGIN_INIT_OPTIONS);
    }

    async getFacetValueIds(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean,
    ): Promise<Map<ID, number>> {
        // ...
        return createFacetIdCountMap(facetValuesResult);
    }

    async getCollectionIds(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean,
    ): Promise<Map<ID, number>> {
        // ...
        return createCollectionIdCountMap(collectionsResult);
    }

    async getSearchResults(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean,
    ): Promise<SearchResult[]> {
        const take = input.take || 25;
        const skip = input.skip || 0;
        const sort = input.sort;
        const qb = this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .select(this.createMysqlSelect(!!input.groupByProduct));
        // ...

        return qb
            .take(take)
            .skip(skip)
            .getRawMany()
            .then(res => res.map(r => mapToSearchResult(r, ctx.channel.currencyCode)));
    }

    async getTotalCount(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<number> {
        const innerQb = this.applyTermAndFilters(
            ctx,
            this.connection
                .getRepository(SearchIndexItem)
                .createQueryBuilder('si')
                .select(this.createMysqlSelect(!!input.groupByProduct)),
            input,
        );
        if (enabledOnly) {
            innerQb.andWhere('si.enabled = :enabled', { enabled: true });
        }

        const totalItemsQb = this.connection.rawConnection
            .createQueryBuilder()
            .select('COUNT(*) as total')
            .from(`(${innerQb.getQuery()})`, 'inner')
            .setParameters(innerQb.getParameters());
        return totalItemsQb.getRawOne().then(res => res.total);
    }
}
```


</div>
