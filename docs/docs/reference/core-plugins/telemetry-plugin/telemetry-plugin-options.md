---
title: "TelemetryPluginOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TelemetryPluginOptions

<GenerationInfo sourceFile="packages/telemetry-plugin/src/types.ts" sourceLine="18" packageName="@vendure/telemetry-plugin" since="3.3.0" />

Configuration options for the TelemetryPlugin.

```ts title="Signature"
interface TelemetryPluginOptions {
    loggerOptions?: OtelLoggerOptions;
    methodHooks?: Array<MethodHookConfig<any>>;
}
```

<div className="members-wrapper">

### loggerOptions

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/telemetry-plugin/otel-logger#otelloggeroptions'>OtelLoggerOptions</a>`}   />

The options for the OtelLogger.

For example, to also include logging to the console, you can use the following:
```ts
import { LogLevel } from '@vendure/core';
import { TelemetryPlugin } from '@vendure/telemetry-plugin';

TelemetryPlugin.init({
    loggerOptions: {
        console: LogLevel.Verbose,
    },
});
```
### methodHooks

<MemberInfo kind="property" type={`Array&#60;MethodHookConfig&#60;any&#62;&#62;`}  experimental="true" />

**Status: Developer Preview**

This API may change in a future release.

Method hooks allow you to add extra telemetry actions to specific methods.
To define hooks on a method, use the <a href='/reference/core-plugins/telemetry-plugin/register-method-hooks#registermethodhooks'>registerMethodHooks</a> function.

*Example*

```ts
import { TelemetryPlugin, registerMethodHooks } from '@vendure/telemetry-plugin';

TelemetryPlugin.init({
  methodHooks: [
    registerMethodHooks(ProductService, {

      // Define some hooks for the `findOne` method
      findOne: {
        // This will be called before the method is executed
        pre: ({ args: [ctx, productId], span }) => {
          span.setAttribute('productId', productId);
        },
        // This will be called after the method is executed
        post: ({ result, span }) => {
          span.setAttribute('found', !!result);
        },
      },
    }),
  ],
});
```


</div>
