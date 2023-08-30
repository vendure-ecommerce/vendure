---
title: "Ctx Decorator"
weight: 10
date: 2023-07-14T16:57:49.410Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Ctx Decorator
<div class="symbol">


# Ctx

{{< generation-info sourceFile="packages/core/src/api/decorators/request-context.decorator.ts" sourceLine="21" packageName="@vendure/core">}}

Resolver param decorator which extracts the <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> from the incoming
request object.

*Example*

```TypeScript
 @Query()
 getAdministrators(@Ctx() ctx: RequestContext) {
     // ...
 }
```

</div>
