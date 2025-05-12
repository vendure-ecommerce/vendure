---
title: "GetSdkConfiguration"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## getSdkConfiguration

<GenerationInfo sourceFile="packages/telemetry-plugin/src/instrumentation.ts" sourceLine="89" packageName="@vendure/telemetry-plugin" />

Creates a configuration object for the OpenTelemetry Node SDK. This is used to set up a custom
preload script which must be run before the main Vendure server is loaded by means of the
Node.js `--require` flag.

*Example*

```ts
// instrumentation.ts
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getSdkConfiguration } from '@vendure/telemetry-plugin/preload';

process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'http://localhost:3100/otlp';
process.env.OTEL_LOGS_EXPORTER = 'otlp';
process.env.OTEL_RESOURCE_ATTRIBUTES = 'service.name=vendure-dev-server';

const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});
const logExporter = new OTLPLogExporter();

const config = getSdkConfiguration({
    config: {
        spanProcessors: [new BatchSpanProcessor(traceExporter)],
        logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
    },
});

const sdk = new NodeSDK(config);

sdk.start();
```

This would them be run as:
```bash
node --require ./dist/instrumentation.js ./dist/server.js
```

```ts title="Signature"
function getSdkConfiguration(options?: SdkConfigurationOptions): Partial<NodeSDKConfiguration>
```
Parameters

### options

<MemberInfo kind="parameter" type={`<a href='/reference/core-plugins/telemetry-plugin/get-sdk-configuration#sdkconfigurationoptions'>SdkConfigurationOptions</a>`} />



## SdkConfigurationOptions

<GenerationInfo sourceFile="packages/telemetry-plugin/src/instrumentation.ts" sourceLine="27" packageName="@vendure/telemetry-plugin" />

Options for configuring the OpenTelemetry Node SDK.

```ts title="Signature"
interface SdkConfigurationOptions {
    logToConsole?: boolean;
    config: Partial<NodeSDKConfiguration>;
}
```

<div className="members-wrapper">

### logToConsole

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

When set to `true`, the SDK will log spans to the console instead of sending them to an
exporter. This should just be used for debugging purposes.
### config

<MemberInfo kind="property" type={`Partial&#60;NodeSDKConfiguration&#62;`}   />

The configuration object for the OpenTelemetry Node SDK.


</div>
