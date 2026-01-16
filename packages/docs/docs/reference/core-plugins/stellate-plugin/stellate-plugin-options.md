---
title: "StellatePluginOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StellatePluginOptions

<GenerationInfo sourceFile="packages/stellate-plugin/src/types.ts" sourceLine="9" packageName="@vendure/stellate-plugin" />

Configuration options for the StellatePlugin.

```ts title="Signature"
interface StellatePluginOptions {
    serviceName: string;
    apiToken: string;
    purgeRules: PurgeRule[];
    defaultBufferTimeMs?: number;
    devMode?: boolean;
    debugLogging?: boolean;
}
```

<div className="members-wrapper">

### serviceName

<MemberInfo kind="property" type={`string`}   />

The Stellate service name, i.e. `<service-name>.stellate.sh`
### apiToken

<MemberInfo kind="property" type={`string`}   />

The Stellate Purging API token. For instructions on how to generate the token,
see the [Stellate docs](https://docs.stellate.co/docs/purging-api#authentication)
### purgeRules

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/stellate-plugin/purge-rule#purgerule'>PurgeRule</a>[]`}   />

An array of <a href='/reference/core-plugins/stellate-plugin/purge-rule#purgerule'>PurgeRule</a> instances which are used to define how the plugin will
respond to Vendure events in order to trigger calls to the Stellate Purging API.
### defaultBufferTimeMs

<MemberInfo kind="property" type={`number`} default={`2000`}   />

When events are published, the PurgeRules will buffer those events in order to efficiently
batch requests to the Stellate Purging API. You may wish to change the default, e.g. if you are
running in a serverless environment and cannot introduce pauses after the main request has completed.
### devMode

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

When set to `true`, calls will not be made to the Stellate Purge API.
### debugLogging

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

If set to true, the plugin will log the calls that would be made
to the Stellate Purge API. Note, this generates a
lot of debug-level logging.


</div>
