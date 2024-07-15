---
title: "ConfigArgType"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ConfigArgType

<GenerationInfo sourceFile="packages/common/src/shared-types.ts" sourceLine="126" packageName="@vendure/common" />

Certain entities (those which implement <a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>) allow arbitrary
configuration arguments to be specified which can then be set in the admin-ui and used in
the business logic of the app. These are the valid data types of such arguments.
The data type influences:

1. How the argument form field is rendered in the admin-ui
2. The JavaScript type into which the value is coerced before being passed to the business logic.

```ts title="Signature"
type ConfigArgType = 'string' | 'int' | 'float' | 'boolean' | 'datetime' | 'ID'
```
