---
title: "PubSubJobQueueStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PubSubJobQueueStrategy

<GenerationInfo sourceFile="packages/job-queue-plugin/src/pub-sub/pub-sub-job-queue-strategy.ts" sourceLine="29" packageName="@vendure/job-queue-plugin" />

This JobQueueStrategy uses Google Cloud Pub/Sub to implement a job queue for Vendure.
It should not be used alone, but as part of the <a href='/reference/core-plugins/job-queue-plugin/pub-sub-plugin#pubsubplugin'>PubSubPlugin</a>.

Note: To use this strategy, you need to manually install the `@google-cloud/pubsub` package:

```shell
npm install

```ts title="Signature"
class PubSubJobQueueStrategy extends InjectableJobQueueStrategy implements JobQueueStrategy {
    init(injector: Injector) => ;
    destroy() => ;
    add(job: Job<Data>) => Promise<Job<Data>>;
    start(queueName: string, process: (job: Job<Data>) => Promise<any>) => ;
    stop(queueName: string, process: (job: Job<Data>) => Promise<any>) => ;
}
```
* Extends: <code>InjectableJobQueueStrategy</code>


* Implements: <code>JobQueueStrategy</code>



<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(injector: Injector) => `}   />


### destroy

<MemberInfo kind="method" type={`() => `}   />


### add

<MemberInfo kind="method" type={`(job: Job&#60;Data&#62;) => Promise&#60;Job&#60;Data&#62;&#62;`}   />


### start

<MemberInfo kind="method" type={`(queueName: string, process: (job: Job&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => `}   />


### stop

<MemberInfo kind="method" type={`(queueName: string, process: (job: Job&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => `}   />




</div>
