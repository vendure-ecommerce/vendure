---
title: "HardenPluginOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## HardenPluginOptions

<GenerationInfo sourceFile="packages/harden-plugin/src/types.ts" sourceLine="9" packageName="@vendure/harden-plugin" />

Options that can be passed to the `.init()` static method of the HardenPlugin.

```ts title="Signature"
interface HardenPluginOptions {
    maxQueryComplexity?: number;
    queryComplexityEstimators?: ComplexityEstimator[];
    logComplexityScore?: boolean;
    customComplexityFactors?: {
        [path: string]: number;
    };
    hideFieldSuggestions?: boolean;
    apiMode?: 'dev' | 'prod';
}
```

<div className="members-wrapper">

### maxQueryComplexity

<MemberInfo kind="property" type={`number`} default="1000"   />

Defines the maximum permitted complexity score of a query. The complexity score is based
on the number of fields being selected as well as other factors like whether there are nested
lists.

A query which exceeds the maximum score will result in an error.
### queryComplexityEstimators

<MemberInfo kind="property" type={`ComplexityEstimator[]`}   />

An array of custom estimator functions for calculating the complexity of a query. By default,
the plugin will use the <a href='/reference/core-plugins/harden-plugin/default-vendure-complexity-estimator#defaultvendurecomplexityestimator'>defaultVendureComplexityEstimator</a> which is specifically
tuned to accurately estimate Vendure queries.
### logComplexityScore

<MemberInfo kind="property" type={`boolean`} default="false"   />

When set to `true`, the complexity score of each query will be logged at the Verbose
log level, and a breakdown of the calculation for each field will be logged at the Debug level.

This is very useful for tuning your complexity scores.
### customComplexityFactors

<MemberInfo kind="property" type={`{         [path: string]: number;     }`}   />

This object allows you to tune the complexity weight of specific fields. For example,
if you have a custom `stockLocations` field defined on the `ProductVariant` type, and
you know that it is a particularly expensive operation to execute, you can increase
its complexity like this:

*Example*

```ts
HardenPlugin.init({
  maxQueryComplexity: 650,
  customComplexityFactors: {
    'ProductVariant.stockLocations': 10
  }
}),
```
### hideFieldSuggestions

<MemberInfo kind="property" type={`boolean`} default="true"   />

Graphql-js will make suggestions about the names of fields if an invalid field name is provided.
This would allow an attacker to find out the available fields by brute force even if introspection
is disabled.

Setting this option to `true` will prevent these suggestion error messages from being returned,
instead replacing the message with a generic "Invalid request" message.
### apiMode

<MemberInfo kind="property" type={`'dev' | 'prod'`} default="'prod'"   />

When set to `'prod'`, the plugin will disable dev-mode features of the GraphQL APIs:

- introspection
- GraphQL playground


</div>
