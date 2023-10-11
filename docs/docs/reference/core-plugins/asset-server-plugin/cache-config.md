---
title: "CacheConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CacheConfig

<GenerationInfo sourceFile="packages/asset-server-plugin/src/types.ts" sourceLine="52" packageName="@vendure/asset-server-plugin" />

A configuration option for the Cache-Control header in the AssetServerPlugin asset response.

```ts title="Signature"
type CacheConfig = {
    maxAge: number;
    restriction?: 'public' | 'private';
}
```

<div className="members-wrapper">

### maxAge

<MemberInfo kind="property" type={`number`}   />

The max-age=N response directive indicates that the response remains fresh until N seconds after the response is generated.
### restriction

<MemberInfo kind="property" type={`'public' | 'private'`}   />

The `private` response directive indicates that the response can be stored only in a private cache (e.g. local caches in browsers).
The `public` response directive indicates that the response can be stored in a shared cache.


</div>
