---
title: "RegisterMethodHooks"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerMethodHooks

<GenerationInfo sourceFile="packages/telemetry-plugin/src/service/method-hooks.service.ts" sourceLine="60" packageName="@vendure/telemetry-plugin" since="3.3.0" />

Allows you to register hooks for a specific method of an instrumented class.
These hooks allow extra telemetry actions to be performed on the method.

They can then be passed to the <a href='/reference/core-plugins/telemetry-plugin/#telemetryplugin'>TelemetryPlugin</a> via the <a href='/reference/core-plugins/telemetry-plugin/telemetry-plugin-options#telemetrypluginoptions'>TelemetryPluginOptions</a>.

*Example*

```typescript
const productServiceHooks = registerMethodHooks(ProductService, {
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
});
```

```ts title="Signature"
function registerMethodHooks<T>(target: Type<T>, hooks: MethodHooksForType<T>): MethodHookConfig<T>
```
Parameters

### target

<MemberInfo kind="parameter" type={`Type&#60;T&#62;`} />

### hooks

<MemberInfo kind="parameter" type={`MethodHooksForType&#60;T&#62;`} />

