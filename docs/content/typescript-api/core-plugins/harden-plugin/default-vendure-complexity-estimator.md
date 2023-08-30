---
title: "DefaultVendureComplexityEstimator"
weight: 10
date: 2023-07-14T16:57:50.832Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# defaultVendureComplexityEstimator
<div class="symbol">


# defaultVendureComplexityEstimator

{{< generation-info sourceFile="packages/harden-plugin/src/middleware/query-complexity-plugin.ts" sourceLine="95" packageName="@vendure/harden-plugin">}}

A complexity estimator which takes into account List and PaginatedList types and can
be further configured by providing a customComplexityFactors object.

When selecting PaginatedList types, the "take" argument is used to estimate a complexity
factor. If the "take" argument is omitted, a default factor of 1000 is applied.

## Signature

```TypeScript
function defaultVendureComplexityEstimator(customComplexityFactors: { [path: string]: number }, logFieldScores: boolean): void
```
## Parameters

### customComplexityFactors

{{< member-info kind="parameter" type="{ [path: string]: number }" >}}

### logFieldScores

{{< member-info kind="parameter" type="boolean" >}}

</div>
