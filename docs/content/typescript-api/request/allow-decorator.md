---
title: "Allow Decorator"
weight: 10
date: 2023-07-14T16:57:49.407Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Allow Decorator
<div class="symbol">


# Allow

{{< generation-info sourceFile="packages/core/src/api/decorators/allow.decorator.ts" sourceLine="38" packageName="@vendure/core">}}

Attaches metadata to the resolver defining which permissions are required to execute the
operation, using one or more <a href='/typescript-api/common/permission#permission'>Permission</a> values.

In a GraphQL context, it can be applied to top-level queries and mutations as well as field resolvers.

For REST controllers, it can be applied to route handlers.

## Allow and Sessions
The `@Allow()` decorator is closely linked to the way Vendure manages sessions. For any operation or route that is decorated
with `@Allow()`, there must be an authenticated session in progress, which would have been created during a prior authentication
step.

The exception to this is when the operation is decorated with `@Allow(Permission.Owner)`. This is a special permission which is designed
to give access to certain resources to potentially un-authenticated users. For this reason, any operation decorated with this permission
will always have an anonymous session created if no session is currently in progress.

For more information see [Understanding Permission.Owner](/docs/typescript-api/common/permission/#understanding-permissionowner).

*Example*

```TypeScript
 @Allow(Permission.SuperAdmin)
 @Query()
 getAdministrators() {
     // ...
 }
```

</div>
