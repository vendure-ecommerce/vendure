import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getSdkConfiguration } from '@vendure/telemetry';

const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});

process.env.OTEL_EXPORTER_OTLP_ENDPOINT = 'http://localhost:3100/otlp';
process.env.OTEL_LOGS_EXPORTER = 'otlp';

const logExporter = new OTLPLogExporter();

const config = getSdkConfiguration(false, {
    spanProcessors: [new BatchSpanProcessor(traceExporter)],
    logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
    resource: resourceFromAttributes({
        'service.name': 'vendure-dev-server',
    }),
});

const sdk = new NodeSDK(config);

sdk.start();
