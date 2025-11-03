---
title: "InstrumentationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## InstrumentationStrategy

<GenerationInfo sourceFile="packages/core/src/config/system/instrumentation-strategy.ts" sourceLine="51" packageName="@vendure/core" since="3.3.0" />

This interface is used to define a strategy for instrumenting methods of
classes which are decorated with the <a href='/reference/typescript-api/telemetry/instrument#instrument'>Instrument</a> decorator.

```ts title="Signature"
interface InstrumentationStrategy extends InjectableStrategy {
    wrapMethod(args: WrappedMethodArgs): any;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### wrapMethod

<MemberInfo kind="method" type={`(args: <a href='/reference/typescript-api/telemetry/wrapped-method-args#wrappedmethodargs'>WrappedMethodArgs</a>) => any`}   />

When a method of an instrumented class is called, it will be wrapped (by means of
a Proxy) and this method will be called. The `applyOriginalFunction` function
will apply the original method and return the result.


</div>
