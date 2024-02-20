---
title: "Allow Decorator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Allow

<GenerationInfo sourceFile="packages/core/src/api/decorators/allow.decorator.ts" sourceLine="38" packageName="@vendure/core" />

Attaches metadata to the resolver defining which permissions are required to execute the
operation, using one or more <a href='/reference/typescript-api/common/permission#permission'>Permission</a> values.

In a GraphQL context, it can be applied to top-level queries and mutations as well as field resolvers.

For REST controllers, it can be applied to route handler.

## Allow and Sessions
The `@Allow()` decorator is closely linked to the way Vendure manages sessions. For any operation or route that is decorated
with `@Allow()`, there must be an authenticated session in progress, which would have been created during a prior authentication
step.

The exception to this is when the operation is decorated with `@Allow(Permission.Owner)`. This is a special permission which is designed
to give access to certain resources to potentially un-authenticated users. For this reason, any operation decorated with this permission
will always have an anonymous session created if no session is currently in progress.

For more information see [Understanding Permission.Owner](/reference/typescript-api/common/permission/#understanding-permissionowner).

*Example*

```ts
 @Allow(Permission.SuperAdmin)
 @Query()
 getAdministrators() {
     // ...
 }
```

