---
title: "TelemetryPlugin"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TelemetryPlugin

<GenerationInfo sourceFile="packages/telemetry-plugin/src/telemetry.plugin.ts" sourceLine="107" packageName="@vendure/telemetry-plugin" since="3.3.0" />

The TelemetryPlugin is used to instrument the Vendure application and collect telemetry data using
[OpenTelemetry](https://opentelemetry.io/).

## Installation

```
npm install @vendure/telemetry-plugin
```

:::info
For a complete guide to setting up and working with Open Telemetry, see
the [Implementing Open Telemetry guide](/guides/how-to/telemetry/).
:::

## Configuration

The plugin is configured via the `TelemetryPlugin.init()` method. This method accepts an options object
which defines the OtelLogger options and method hooks.

*Example*

```ts
import { VendureConfig } from '@vendure/core';
import { TelemetryPlugin, registerMethodHooks } from '@vendure/telemetry-plugin';

export const config: VendureConfig = {
  // ...
  plugins: [
    TelemetryPlugin.init({
      loggerOptions: {
        // Log to the console at the verbose level
        console: LogLevel.Verbose,
      },
    }),
  ],
};
```

## Preloading the SDK

In order to use the OpenTelemetry SDK, you must preload it before the Vendure server is started.
This is done by using the `--require` flag when starting the server with a custom preload script.

Create a file named `instrumentation.ts` in the root of your project and add the following code:

```ts
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getSdkConfiguration } from '@vendure/telemetry-plugin/preload';

// In this example we are using Loki as the OTLP endpoint for logging
process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'http://localhost:3100/otlp';
process.env.OTEL_LOGS_EXPORTER = 'otlp';
process.env.OTEL_RESOURCE_ATTRIBUTES = 'service.name=vendure-dev-server';

// We are using Jaeger as the OTLP endpoint for tracing
const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});
const logExporter = new OTLPLogExporter();

// The getSdkConfiguration method returns a configuration object for the OpenTelemetry Node SDK.
// It also performs other configuration tasks such as setting a special environment variable
// to enable instrumentation in the Vendure core code.
const config = getSdkConfiguration({
    config: {
        // Pass in any custom configuration options for the Node SDK here
        spanProcessors: [new BatchSpanProcessor(traceExporter)],
        logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
    },
});

const sdk = new NodeSDK(config);

sdk.start();
```

The server would then be started with the following command:

```bash
node --require ./dist/instrumentation.js ./dist/server.js
```

or for development with ts-node:

```bash
npx ts-node --require ./src/instrumentation.ts ./src/server.ts
```

```ts title="Signature"
class TelemetryPlugin {
    static options: TelemetryPluginOptions = {};
    constructor(methodHooksService: MethodHooksService, options: TelemetryPluginOptions)
    init(options: TelemetryPluginOptions) => ;
}
```

<div className="members-wrapper">

### options

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/telemetry-plugin/telemetry-plugin-options#telemetrypluginoptions'>TelemetryPluginOptions</a>`}   />


### constructor

<MemberInfo kind="method" type={`(methodHooksService: MethodHooksService, options: <a href='/reference/core-plugins/telemetry-plugin/telemetry-plugin-options#telemetrypluginoptions'>TelemetryPluginOptions</a>) => TelemetryPlugin`}   />


### init

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/telemetry-plugin/telemetry-plugin-options#telemetrypluginoptions'>TelemetryPluginOptions</a>) => `}   />




</div>
