---
title: "Api Decorator"
weight: 10
date: 2023-07-14T16:57:49.409Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Api Decorator
<div class="symbol">


# Api

{{< generation-info sourceFile="packages/core/src/api/decorators/api.decorator.ts" sourceLine="26" packageName="@vendure/core">}}

Resolver param decorator which returns which Api the request came though.
This is useful because sometimes the same resolver will have different behaviour
depending whether it is being called from the shop API or the admin API.

Returns a string of type <a href='/typescript-api/request/api-type#apitype'>ApiType</a>.

*Example*

```TypeScript
 @Query()
 getAdministrators(@Api() apiType: ApiType) {
   if (apiType === 'admin') {
     // ...
   }
 }
```

</div>
