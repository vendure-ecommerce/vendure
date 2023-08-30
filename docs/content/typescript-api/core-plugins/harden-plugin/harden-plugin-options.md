---
title: "HardenPluginOptions"
weight: 10
date: 2023-07-14T16:57:50.832Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HardenPluginOptions
<div class="symbol">


# HardenPluginOptions

{{< generation-info sourceFile="packages/harden-plugin/src/types.ts" sourceLine="9" packageName="@vendure/harden-plugin">}}

Options that can be passed to the `.init()` static method of the HardenPlugin.

## Signature

```TypeScript
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
## Members

### maxQueryComplexity

{{< member-info kind="property" type="number" default="1000"  >}}

{{< member-description >}}Defines the maximum permitted complexity score of a query. The complexity score is based
on the number of fields being selected as well as other factors like whether there are nested
lists.

A query which exceeds the maximum score will result in an error.{{< /member-description >}}

### queryComplexityEstimators

{{< member-info kind="property" type="ComplexityEstimator[]"  >}}

{{< member-description >}}An array of custom estimator functions for calculating the complexity of a query. By default,
the plugin will use the <a href='/typescript-api/core-plugins/harden-plugin/default-vendure-complexity-estimator#defaultvendurecomplexityestimator'>defaultVendureComplexityEstimator</a> which is specifically
tuned to accurately estimate Vendure queries.{{< /member-description >}}

### logComplexityScore

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}When set to `true`, the complexity score of each query will be logged at the Verbose
log level, and a breakdown of the calculation for each field will be logged at the Debug level.

This is very useful for tuning your complexity scores.{{< /member-description >}}

### customComplexityFactors

{{< member-info kind="property" type="{         [path: string]: number;     }"  >}}

{{< member-description >}}This object allows you to tune the complexity weight of specific fields. For example,
if you have a custom `stockLocations` field defined on the `ProductVariant` type, and
you know that it is a particularly expensive operation to execute, you can increase
its complexity like this:

*Example*

```TypeScript
HardenPlugin.init({
  maxQueryComplexity: 650,
  customComplexityFactors: {
    'ProductVariant.stockLocations': 10
  }
}),
```{{< /member-description >}}

### hideFieldSuggestions

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Graphql-js will make suggestions about the names of fields if an invalid field name is provided.
This would allow an attacker to find out the available fields by brute force even if introspection
is disabled.

Setting this option to `true` will prevent these suggestion error messages from being returned,
instead replacing the message with a generic "Invalid request" message.{{< /member-description >}}

### apiMode

{{< member-info kind="property" type="'dev' | 'prod'" default="'prod'"  >}}

{{< member-description >}}When set to `'prod'`, the plugin will disable dev-mode features of the GraphQL APIs:

- introspection
- GraphQL playground{{< /member-description >}}


</div>
