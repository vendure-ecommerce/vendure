---
title: "MergeConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## mergeConfig

<GenerationInfo sourceFile="packages/core/src/config/merge-config.ts" sourceLine="30" packageName="@vendure/core" />

Performs a deep merge of two VendureConfig objects. Unlike `Object.assign()` the `target` object is
not mutated, instead the function returns a new object which is the result of deeply merging the
values of `source` into `target`.

Arrays do not get merged, they are treated as a single value that will be replaced. So if merging the
`plugins` array, you must explicitly concatenate the array.

*Example*

```ts
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

```ts title="Signature"
function mergeConfig<T extends VendureConfig>(target: T, source: PartialVendureConfig, depth:  = 0): T
```
Parameters

### target

<MemberInfo kind="parameter" type={`T`} />

### source

<MemberInfo kind="parameter" type={`PartialVendureConfig`} />

### depth

<MemberInfo kind="parameter" type={``} />

