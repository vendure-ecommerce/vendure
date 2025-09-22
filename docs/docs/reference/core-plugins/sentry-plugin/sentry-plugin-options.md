---
title: "SentryPluginOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SentryPluginOptions

<GenerationInfo sourceFile="packages/sentry-plugin/src/types.ts" sourceLine="7" packageName="@vendure/sentry-plugin" />

Configuration options for the <a href='/reference/core-plugins/sentry-plugin/#sentryplugin'>SentryPlugin</a>.

```ts title="Signature"
interface SentryPluginOptions {
    includeErrorTestMutation?: boolean;
}
```

<div className="members-wrapper">

### includeErrorTestMutation

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

Whether to include the error test mutation in the admin API.


</div>
