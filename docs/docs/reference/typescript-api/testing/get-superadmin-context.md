---
title: "GetSuperadminContext"
weight: 10
date: 2023-07-14T16:57:50.829Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# getSuperadminContext
<div class="symbol">


# getSuperadminContext

{{< generation-info sourceFile="packages/testing/src/utils/get-superadmin-context.ts" sourceLine="11" packageName="@vendure/testing">}}

Creates a <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> configured for the default Channel with the activeUser set
as the superadmin user. Useful for populating data.

## Signature

```TypeScript
function getSuperadminContext(app: INestApplicationContext): Promise<RequestContext>
```
## Parameters

### app

{{< member-info kind="parameter" type="INestApplicationContext" >}}

</div>
