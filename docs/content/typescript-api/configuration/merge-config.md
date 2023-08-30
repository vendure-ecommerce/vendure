---
title: "MergeConfig"
weight: 10
date: 2023-07-14T16:57:49.576Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# mergeConfig
<div class="symbol">


# mergeConfig

{{< generation-info sourceFile="packages/core/src/config/merge-config.ts" sourceLine="30" packageName="@vendure/core">}}

Performs a deep merge of two VendureConfig objects. Unlike `Object.assign()` the `target` object is
not mutated, instead the function returns a new object which is the result of deeply merging the
values of `source` into `target`.

Arrays do not get merged, they are treated as a single value that will be replaced. So if merging the
`plugins` array, you must explicitly concatenate the array.

*Example*

```TypeScript
const result = mergeConfig(defaultConfig, {
  assetOptions: {
    uploadMaxFileSize: 5000,
  },
  plugins: [
    ...defaultConfig.plugins,
    MyPlugin,
  ]
};
```

## Signature

```TypeScript
function mergeConfig<T extends VendureConfig>(target: T, source: PartialVendureConfig, depth:  = 0): T
```
## Parameters

### target

{{< member-info kind="parameter" type="T" >}}

### source

{{< member-info kind="parameter" type="PartialVendureConfig" >}}

### depth

{{< member-info kind="parameter" type="" >}}

</div>
