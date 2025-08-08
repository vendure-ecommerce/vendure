---
title: "SentryService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SentryService

<GenerationInfo sourceFile="packages/sentry-plugin/src/sentry.service.ts" sourceLine="13" packageName="@vendure/sentry-plugin" />

Service for capturing errors and messages to Sentry.

```ts title="Signature"
class SentryService {
    constructor(options: SentryPluginOptions)
    captureException(exception: Error) => ;
    captureMessage(message: string, captureContext?: CaptureContext) => ;
    startSpan(context: StartSpanOptions) => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/sentry-plugin/sentry-plugin-options#sentrypluginoptions'>SentryPluginOptions</a>) => SentryService`}   />


### captureException

<MemberInfo kind="method" type={`(exception: Error) => `}   />


### captureMessage

<MemberInfo kind="method" type={`(message: string, captureContext?: CaptureContext) => `}   />

Captures a message
### startSpan

<MemberInfo kind="method" type={`(context: StartSpanOptions) => `}   />

Starts new span


</div>
