import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getSdkConfiguration } from '@vendure/telemetry';

const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});

const config = getSdkConfiguration(true);

const sdk = new NodeSDK(config);

//sdk.start();
