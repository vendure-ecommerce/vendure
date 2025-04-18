import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getSdkConfiguration } from '@vendure/telemetry';

const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});

const config = getSdkConfiguration(false, {
    spanProcessors: [new BatchSpanProcessor(traceExporter)],
    resource: resourceFromAttributes({
        'service.name': 'vendure-dev-server',
    }),
});

const sdk = new NodeSDK(config);

sdk.start();
