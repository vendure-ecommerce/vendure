---
title: "CreateErrorResultGuard"
weight: 10
date: 2023-07-14T16:57:50.804Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# createErrorResultGuard
<div class="symbol">


# createErrorResultGuard

{{< generation-info sourceFile="packages/testing/src/error-result-guard.ts" sourceLine="18" packageName="@vendure/testing">}}

Convenience method for creating an <a href='/typescript-api/testing/error-result-guard#errorresultguard'>ErrorResultGuard</a>. Takes a predicate function which
tests whether the input is considered successful (true) or an error result (false).

Note that the resulting variable must _still_ be type annotated in order for the TypeScript
type inference to work as expected:

*Example*

```TypeScript
const orderResultGuard: ErrorResultGuard<AddItemToOrderResult>
  = createErrorResultGuard(order => !!order.lines);
```

## Signature

```TypeScript
function createErrorResultGuard<T>(testFn: (input: T) => boolean): ErrorResultGuard<T>
```
## Parameters

### testFn

{{< member-info kind="parameter" type="(input: T) =&#62; boolean" >}}

</div>
