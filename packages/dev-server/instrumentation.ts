import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Instrumentation } from '@opentelemetry/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const traceExporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});

const metricExporter = new OTLPMetricExporter({
    url: 'http://localhost:4318/v1/metrics',
});

const instrumentations: Instrumentation[] = [];

const httpInstrumentation = new HttpInstrumentation();
const expressInstrumentation = new ExpressInstrumentation();
const graphqlInstrumentation = new GraphQLInstrumentation({
    mergeItems: true,
});

instrumentations.push(new NestInstrumentation());
instrumentations.push(...[httpInstrumentation, expressInstrumentation, graphqlInstrumentation]);
instrumentations.push(new PgInstrumentation());
instrumentations.push(new IORedisInstrumentation());

const sdk = new NodeSDK({
    spanProcessors: [new SimpleSpanProcessor(traceExporter)],
    metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
    }),
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'vendure-local-dev-server',
        [ATTR_SERVICE_VERSION]: '1.0',
    }),
    instrumentations,
});

sdk.start();
