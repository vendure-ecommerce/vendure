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

<GenerationInfo sourceFile="packages/sentry-plugin/src/types.ts" sourceLine="12" packageName="@vendure/sentry-plugin" />

Configuration options for the <a href='/reference/core-plugins/sentry-plugin/#sentryplugin'>SentryPlugin</a>.

```ts title="Signature"
interface SentryPluginOptions extends NodeOptions {
    dsn: string;
    enableTracing?: boolean;
    includeErrorTestMutation?: boolean;
}
```
* Extends: <code>NodeOptions</code>



<div className="members-wrapper">

### dsn

<MemberInfo kind="property" type={`string`}   />

The [Data Source Name](https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/) for your Sentry instance.
### enableTracing

<MemberInfo kind="property" type={`boolean`}   />


### includeErrorTestMutation

<MemberInfo kind="property" type={`boolean`}   />




</div>
