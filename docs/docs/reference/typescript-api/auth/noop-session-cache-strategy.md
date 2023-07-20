---
title: "NoopSessionCacheStrategy"
weight: 10
date: 2023-07-20T13:56:14.723Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## NoopSessionCacheStrategy

<GenerationInfo sourceFile="packages/core/src/config/session-cache/noop-session-cache-strategy.ts" sourceLine="10" packageName="@vendure/core" />

A cache that doesn't cache. The cache lookup will miss every time
so the session will always be taken from the database.

```ts title="Signature"
class NoopSessionCacheStrategy implements SessionCacheStrategy {
  clear() => ;
  delete(sessionToken: string) => ;
  get(sessionToken: string) => ;
  set(session: CachedSession) => ;
}
```
Implements

 * <a href='/typescript-api/auth/session-cache-strategy#sessioncachestrategy'>SessionCacheStrategy</a>



### clear

<MemberInfo kind="method" type="() => "   />


### delete

<MemberInfo kind="method" type="(sessionToken: string) => "   />


### get

<MemberInfo kind="method" type="(sessionToken: string) => "   />


### set

<MemberInfo kind="method" type="(session: <a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => "   />


