---
title: "PubSubPlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PubSubPlugin

<GenerationInfo sourceFile="packages/job-queue-plugin/src/pub-sub/plugin.ts" sourceLine="22" packageName="@vendure/job-queue-plugin" />

This plugin uses Google Cloud Pub/Sub to implement a job queue strategy for Vendure.

## Installation

Note: To use this plugin, you need to manually install the `@google-cloud/pubsub` package:

```shell
npm install

```ts title="Signature"
class PubSubPlugin {
    init(options: PubSubOptions) => Type<PubSubPlugin>;
}
```

<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(options: PubSubOptions) => Type&#60;<a href='/reference/core-plugins/job-queue-plugin/pub-sub-plugin#pubsubplugin'>PubSubPlugin</a>&#62;`}   />




</div>
