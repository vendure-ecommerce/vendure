---
title: "SqlCacheStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SqlCacheStrategy

<GenerationInfo sourceFile="packages/core/src/plugin/default-cache-plugin/sql-cache-strategy.ts" sourceLine="18" packageName="@vendure/core" since="3.1.0" />



```ts title="Signature"
class SqlCacheStrategy implements CacheStrategy {
    protected cacheSize = 10_000;
    protected ttlProvider: CacheTtlProvider;
    constructor(config?: { cacheSize?: number; cacheTtlProvider?: CacheTtlProvider })
    protected connection: TransactionalConnection;
    protected configService: ConfigService;
    init(injector: Injector) => ;
    get(key: string) => Promise<T | undefined>;
    set(key: string, value: T, options?: SetCacheKeyOptions) => ;
    delete(key: string) => ;
    invalidateTags(tags: string[]) => ;
}
```
* Implements: <code><a href='/reference/typescript-api/cache/cache-strategy#cachestrategy'>CacheStrategy</a></code>



<div className="members-wrapper">

### cacheSize

<MemberInfo kind="property" type={``}   />


### ttlProvider

<MemberInfo kind="property" type={`CacheTtlProvider`}   />


### constructor

<MemberInfo kind="method" type={`(config?: { cacheSize?: number; cacheTtlProvider?: CacheTtlProvider }) => SqlCacheStrategy`}   />


### connection

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>`}   />


### configService

<MemberInfo kind="property" type={`ConfigService`}   />


### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### get

<MemberInfo kind="method" type={`(key: string) => Promise&#60;T | undefined&#62;`}   />


### set

<MemberInfo kind="method" type={`(key: string, value: T, options?: SetCacheKeyOptions) => `}   />


### delete

<MemberInfo kind="method" type={`(key: string) => `}   />


### invalidateTags

<MemberInfo kind="method" type={`(tags: string[]) => `}   />




</div>
