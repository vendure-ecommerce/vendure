---
title: "SearchStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SearchStrategy

<GenerationInfo sourceFile="packages/core/src/plugin/default-search-plugin/search-strategy/search-strategy.ts" sourceLine="21" packageName="@vendure/core" />

This interface defines the contract that any database-specific search implementations
should follow.

:::info

This is configured via the `searchStrategy` property of
the <a href='/reference/typescript-api/default-search-plugin/default-search-plugin-init-options#defaultsearchplugininitoptions'>DefaultSearchPluginInitOptions</a>.

:::

```ts title="Signature"
interface SearchStrategy extends InjectableStrategy {
    getSearchResults(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<SearchResult[]>;
    getTotalCount(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<number>;
    getFacetValueIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<Map<ID, number>>;
    getCollectionIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<Map<ID, number>>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### getSearchResults

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SearchInput, enabledOnly: boolean) => Promise&#60;SearchResult[]&#62;`}   />


### getTotalCount

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SearchInput, enabledOnly: boolean) => Promise&#60;number&#62;`}   />


### getFacetValueIds

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SearchInput, enabledOnly: boolean) => Promise&#60;Map&#60;<a href='/reference/typescript-api/common/id#id'>ID</a>, number&#62;&#62;`}   />


### getCollectionIds

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SearchInput, enabledOnly: boolean) => Promise&#60;Map&#60;<a href='/reference/typescript-api/common/id#id'>ID</a>, number&#62;&#62;`}   />




</div>
