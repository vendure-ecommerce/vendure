---
title: "Ctx Decorator"
weight: 10
date: 2023-07-21T07:16:59.913Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Ctx

<GenerationInfo sourceFile="packages/core/src/api/decorators/request-context.decorator.ts" sourceLine="21" packageName="@vendure/core" />

Resolver param decorator which extracts the <a href='/docs/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> from the incoming
request object.

*Example*

```ts
 @Query()
 getAdministrators(@Ctx() ctx: RequestContext) {
     // ...
 }
```

