---
title: "ConfigArgType"
weight: 10
date: 2023-07-14T16:57:50.657Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ConfigArgType
<div class="symbol">


# ConfigArgType

{{< generation-info sourceFile="packages/common/src/shared-types.ts" sourceLine="125" packageName="@vendure/common">}}

Certain entities (those which implement <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>) allow arbitrary
configuration arguments to be specified which can then be set in the admin-ui and used in
the business logic of the app. These are the valid data types of such arguments.
The data type influences:

1. How the argument form field is rendered in the admin-ui
2. The JavaScript type into which the value is coerced before being passed to the business logic.

## Signature

```TypeScript
type ConfigArgType = 'string' | 'int' | 'float' | 'boolean' | 'datetime' | 'ID'
```
</div>
