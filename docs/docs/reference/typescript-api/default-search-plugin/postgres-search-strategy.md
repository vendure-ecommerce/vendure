---
title: "PostgresSearchStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PostgresSearchStrategy

<GenerationInfo sourceFile="packages/core/src/plugin/default-search-plugin/search-strategy/postgres-search-strategy.ts" sourceLine="28" packageName="@vendure/core" />

A weighted fulltext search for PostgeSQL.

```ts title="Signature"
class PostgresSearchStrategy implements SearchStrategy {
    init(injector: Injector) => ;
    getFacetValueIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean) => Promise<Map<ID, number>>;
    getCollectionIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean) => Promise<Map<ID, number>>;
    getSearchResults(ctx: RequestContext, input: SearchInput, enabledOnly: boolean) => Promise<SearchResult[]>;
    getTotalCount(ctx: RequestContext, input: SearchInput, enabledOnly: boolean) => Promise<number>;
}
```
* Implements: <code><a href='/reference/typescript-api/default-search-plugin/search-strategy#searchstrategy'>SearchStrategy</a></code>



<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### getFacetValueIds

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SearchInput, enabledOnly: boolean) => Promise&#60;Map&#60;<a href='/reference/typescript-api/common/id#id'>ID</a>, number&#62;&#62;`}   />


### getCollectionIds

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SearchInput, enabledOnly: boolean) => Promise&#60;Map&#60;<a href='/reference/typescript-api/common/id#id'>ID</a>, number&#62;&#62;`}   />


### getSearchResults

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SearchInput, enabledOnly: boolean) => Promise&#60;SearchResult[]&#62;`}   />


### getTotalCount

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SearchInput, enabledOnly: boolean) => Promise&#60;number&#62;`}   />




</div>
