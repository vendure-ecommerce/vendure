---
title: "EntityId Decorator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EntityId

<GenerationInfo sourceFile="packages/core/src/entity/entity-id.decorator.ts" sourceLine="41" packageName="@vendure/core" />

Decorates a property which points to another entity by ID. This custom decorator is needed
because we do not know the data type of the ID column until runtime, when we have access
to the configured EntityIdStrategy.

```ts title="Signature"
function EntityId(options?: IdColumnOptions): void
```
Parameters

### options

<MemberInfo kind="parameter" type={`IdColumnOptions`} />

