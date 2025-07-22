---
title: "SelfRefreshingCache"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SelfRefreshingCache

<GenerationInfo sourceFile="packages/core/src/common/self-refreshing-cache.ts" sourceLine="10" packageName="@vendure/core" />

A cache which automatically refreshes itself if the value is found to be stale.

```ts title="Signature"
interface SelfRefreshingCache<V, RefreshArgs extends any[] = []> {
    value(...refreshArgs: RefreshArgs | [undefined] | []): Promise<V>;
    memoize<Args extends any[], R>(
        args: Args,
        refreshArgs: RefreshArgs,
        fn: (value: V, ...args: Args) => R,
    ): Promise<R>;
    refresh(...args: RefreshArgs): Promise<V>;
}
```

<div className="members-wrapper">

### value

<MemberInfo kind="method" type={`(refreshArgs: RefreshArgs | [undefined] | []) => Promise&#60;V&#62;`}   />

The current value of the cache. If the value is stale, the data will be refreshed and then
the fresh value will be returned.
### memoize

<MemberInfo kind="method" type={`(args: Args, refreshArgs: RefreshArgs, fn: (value: V, ...args: Args) =&#62; R) => Promise&#60;R&#62;`}   />

Allows a memoized function to be defined. For the given arguments, the `fn` function will
be invoked only once and its output cached and returned.
The results cache is cleared along with the rest of the cache according to the configured
`ttl` value.
### refresh

<MemberInfo kind="method" type={`(args: RefreshArgs) => Promise&#60;V&#62;`}   />

Force a refresh of the value, e.g. when it is known that the value has changed such as after
an update operation to the source data in the database.


</div>


## SelfRefreshingCacheConfig

<GenerationInfo sourceFile="packages/core/src/common/self-refreshing-cache.ts" sourceLine="46" packageName="@vendure/core" />

Configuration options for creating a <a href='/reference/typescript-api/cache/self-refreshing-cache#selfrefreshingcache'>SelfRefreshingCache</a>.

```ts title="Signature"
interface SelfRefreshingCacheConfig<V, RefreshArgs extends any[]> {
    name: string;
    ttl: number;
    refresh: {
        fn: (...args: RefreshArgs) => Promise<V>;
        /**
         * Default arguments, passed to refresh function
         */
        defaultArgs: RefreshArgs;
    };
    getTimeFn?: () => number;
}
```

<div className="members-wrapper">

### name

<MemberInfo kind="property" type={`string`}   />

The name of the cache, used for logging purposes.
e.g. `'MyService.cachedValue'`.
### ttl

<MemberInfo kind="property" type={`number`}   />

The time-to-live (ttl) in milliseconds for the cache. After this time, the value will be considered stale
and will be refreshed the next time it is accessed.
### refresh

<MemberInfo kind="property" type={`{         fn: (...args: RefreshArgs) =&#62; Promise&#60;V&#62;;         /**          * Default arguments, passed to refresh function          */         defaultArgs: RefreshArgs;     }`}   />

The function which is used to refresh the value of the cache.
This function should return a Promise which resolves to the new value.
### getTimeFn

<MemberInfo kind="property" type={`() =&#62; number`}   />

Intended for unit testing the SelfRefreshingCache only.
By default uses `() => new Date().getTime()`


</div>


## createSelfRefreshingCache

<GenerationInfo sourceFile="packages/core/src/common/self-refreshing-cache.ts" sourceLine="114" packageName="@vendure/core" />

Creates a <a href='/reference/typescript-api/cache/self-refreshing-cache#selfrefreshingcache'>SelfRefreshingCache</a> object, which is used to cache a single frequently-accessed value. In this type
of cache, the function used to populate the value (`refreshFn`) is defined during the creation of the cache, and
it is immediately used to populate the initial value.

From there, when the `.value` property is accessed, it will return a value from the cache, and if the
value has expired, it will automatically run the `refreshFn` to update the value and then return the
fresh value.

*Example*

```ts title="Example of creating a SelfRefreshingCache"
import { createSelfRefreshingCache } from '@vendure/core';

@Injectable()
export class PublicChannelService {
  private publicChannel: SelfRefreshingCache<Channel, [RequestContext]>;

  async init() {
    this.publicChannel = await createSelfRefreshingCache<Channel, [RequestContext]>({
     name: 'PublicChannelService.publicChannel',
     ttl: 1000 * 60 * 60, // 1 hour
     refresh: {
       fn: async (ctx: RequestContext) => {
        return this.channelService.getPublicChannel(ctx);
      },
     defaultArgs: [RequestContext.empty()],
    },
  });
}
```

```ts title="Signature"
function createSelfRefreshingCache<V, RefreshArgs extends any[]>(config: SelfRefreshingCacheConfig<V, RefreshArgs>, refreshArgs?: RefreshArgs): Promise<SelfRefreshingCache<V, RefreshArgs>>
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/cache/self-refreshing-cache#selfrefreshingcacheconfig'>SelfRefreshingCacheConfig</a>&#60;V, RefreshArgs&#62;`} />

### refreshArgs

<MemberInfo kind="parameter" type={`RefreshArgs`} />

