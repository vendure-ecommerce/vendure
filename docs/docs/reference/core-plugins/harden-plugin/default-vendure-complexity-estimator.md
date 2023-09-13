---
title: "DefaultVendureComplexityEstimator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## defaultVendureComplexityEstimator

<GenerationInfo sourceFile="packages/harden-plugin/src/middleware/query-complexity-plugin.ts" sourceLine="94" packageName="@vendure/harden-plugin" />

A complexity estimator which takes into account List and PaginatedList types and can
be further configured by providing a customComplexityFactors object.

When selecting PaginatedList types, the "take" argument is used to estimate a complexity
factor. If the "take" argument is omitted, a default factor of 1000 is applied.

```ts title="Signature"
function defaultVendureComplexityEstimator(customComplexityFactors: { [path: string]: number }, logFieldScores: boolean): void
```
Parameters

### customComplexityFactors

<MemberInfo kind="parameter" type={`{ [path: string]: number }`} />

### logFieldScores

<MemberInfo kind="parameter" type={`boolean`} />

