---
title: "DefaultSearchPluginInitOptions"
weight: 10
date: 2023-07-14T16:57:50.205Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultSearchPluginInitOptions
<div class="symbol">


# DefaultSearchPluginInitOptions

{{< generation-info sourceFile="packages/core/src/plugin/default-search-plugin/types.ts" sourceLine="15" packageName="@vendure/core">}}

Options which configure the behaviour of the DefaultSearchPlugin

## Signature

```TypeScript
interface DefaultSearchPluginInitOptions {
  indexStockStatus?: boolean;
  bufferUpdates?: boolean;
  searchStrategy?: SearchStrategy;
}
```
## Members

### indexStockStatus

{{< member-info kind="property" type="boolean" default="false."  >}}

{{< member-description >}}If set to `true`, the stock status of a ProductVariant (inStock: Boolean) will
be exposed in the `search` query results. Enabling this option on an existing
Vendure installation will require a DB migration/synchronization.{{< /member-description >}}

### bufferUpdates

{{< member-info kind="property" type="boolean" default="false"  since="1.3.0" >}}

{{< member-description >}}If set to `true`, updates to Products, ProductVariants and Collections will not immediately
trigger an update to the search index. Instead, all these changes will be buffered and will
only be run via a call to the `runPendingSearchIndexUpdates` mutation in the Admin API.

This is very useful for installations with a large number of ProductVariants and/or
Collections, as the buffering allows better control over when these expensive jobs are run,
and also performs optimizations to minimize the amount of work that needs to be performed by
the worker.{{< /member-description >}}

### searchStrategy

{{< member-info kind="property" type="SearchStrategy" default="undefined"  since="1.6.0" >}}

{{< member-description >}}Set a custom search strategy that implements {@link SearchStrategy} or extends an existing search strategy
such as {@link MysqlSearchStrategy}, {@link PostgresSearchStrategy} or {@link SqliteSearchStrategy}.

*Example*

```Typescript
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
```{{< /member-description >}}


</div>
