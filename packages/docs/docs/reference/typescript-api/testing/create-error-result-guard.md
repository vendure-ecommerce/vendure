---
title: "CreateErrorResultGuard"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## createErrorResultGuard

<GenerationInfo sourceFile="packages/testing/src/error-result-guard.ts" sourceLine="18" packageName="@vendure/testing" />

Convenience method for creating an <a href='/reference/typescript-api/testing/error-result-guard#errorresultguard'>ErrorResultGuard</a>. Takes a predicate function which
tests whether the input is considered successful (true) or an error result (false).

Note that the resulting variable must _still_ be type annotated in order for the TypeScript
type inference to work as expected:

*Example*

```ts
const orderResultGuard: ErrorResultGuard<AddItemToOrderResult>
  = createErrorResultGuard(order => !!order.lines);
```

```ts title="Signature"
function createErrorResultGuard<T>(testFn: (input: T) => boolean): ErrorResultGuard<T>
```
Parameters

### testFn

<MemberInfo kind="parameter" type={`(input: T) =&#62; boolean`} />

