---
title: "WrappedMethodArgs"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## WrappedMethodArgs

<GenerationInfo sourceFile="packages/core/src/config/system/instrumentation-strategy.ts" sourceLine="13" packageName="@vendure/core" since="3.3.0" />

The arguments that are passed to the `wrapMethod` method of the
<a href='/reference/typescript-api/telemetry/instrumentation-strategy#instrumentationstrategy'>InstrumentationStrategy</a> interface.

```ts title="Signature"
interface WrappedMethodArgs {
    instance: any;
    target: Type<any>;
    methodName: string;
    args: any[];
    applyOriginalFunction: () => any | Promise<any>;
}
```

<div className="members-wrapper">

### instance

<MemberInfo kind="property" type={`any`}   />

The instance of the class which is being instrumented.
### target

<MemberInfo kind="property" type={`Type&#60;any&#62;`}   />

The class which is being instrumented.
### methodName

<MemberInfo kind="property" type={`string`}   />

The name of the method which is being instrumented.
### args

<MemberInfo kind="property" type={`any[]`}   />

The arguments which are passed to the method.
### applyOriginalFunction

<MemberInfo kind="property" type={`() =&#62; any | Promise&#60;any&#62;`}   />

A function which applies the original method and returns the result.
This is used to call the original method after the instrumentation has
been applied.


</div>
