---
title: "DefaultSchedulerPlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultSchedulerPlugin

<GenerationInfo sourceFile="packages/core/src/plugin/default-scheduler-plugin/default-scheduler.plugin.ts" sourceLine="39" packageName="@vendure/core" since="3.3.0" />

This plugin configures a default scheduling strategy that executes scheduled
tasks using the database to ensure that each task is executed exactly once
at the scheduled time, even if there are multiple instances of the worker
running.

*Example*

```ts
import { DefaultSchedulerPlugin, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
  plugins: [
    DefaultSchedulerPlugin.init({
      // The default is 60s, but you can override it here
      defaultTimeout: '10s',
    }),
  ],
};
```

```ts title="Signature"
class DefaultSchedulerPlugin {
    static options: DefaultSchedulerPluginOptions = {
        defaultTimeout: DEFAULT_TIMEOUT,
        manualTriggerCheckInterval: DEFAULT_MANUAL_TRIGGER_CHECK_INTERVAL,
    };
    init(config?: DefaultSchedulerPluginOptions) => ;
}
```

<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/scheduled-tasks/default-scheduler-plugin#defaultschedulerpluginoptions'>DefaultSchedulerPluginOptions</a>`}   />


### init

<MemberInfo kind="method" type={`(config?: <a href='/reference/typescript-api/scheduled-tasks/default-scheduler-plugin#defaultschedulerpluginoptions'>DefaultSchedulerPluginOptions</a>) => `}   />




</div>


## DefaultSchedulerPluginOptions

<GenerationInfo sourceFile="packages/core/src/plugin/default-scheduler-plugin/types.ts" sourceLine="9" packageName="@vendure/core" since="3.3.0" />

The options for the <a href='/reference/typescript-api/scheduled-tasks/default-scheduler-plugin#defaultschedulerplugin'>DefaultSchedulerPlugin</a>.

```ts title="Signature"
interface DefaultSchedulerPluginOptions {
    defaultTimeout?: string | number;
    manualTriggerCheckInterval?: string | number;
}
```

<div className="members-wrapper">

### defaultTimeout

<MemberInfo kind="property" type={`string | number`} default={`60_000ms`}   />

The default timeout for scheduled tasks.
### manualTriggerCheckInterval

<MemberInfo kind="property" type={`string | number`} default={`10_000ms`}   />

The interval at which the plugin will check for manually triggered tasks.


</div>
