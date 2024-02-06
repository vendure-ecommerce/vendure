---
title: "Money Decorator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Money

<GenerationInfo sourceFile="packages/core/src/entity/money.decorator.ts" sourceLine="26" packageName="@vendure/core" since="2.0.0" />

Use this decorator for any entity field that is storing a monetary value.
This allows the column type to be defined by the configured <a href='/reference/typescript-api/money/money-strategy#moneystrategy'>MoneyStrategy</a>.

```ts title="Signature"
function Money(options?: MoneyColumnOptions): void
```
Parameters

### options

<MemberInfo kind="parameter" type={`MoneyColumnOptions`} />

