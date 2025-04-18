import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { VENDURE_VERSION } from '@vendure/core';

export function getSdkConfiguration(
    instrumentationEnabled: boolean = true,
    devMode: boolean = false,
    config: Partial<NodeSDKConfiguration> = {},
): Partial<NodeSDKConfiguration> {
    const { spanProcessors, ...rest } = config;

    const devModeAwareConfig: Partial<NodeSDKConfiguration> = devMode
        ? {
              spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
          }
        : {
              spanProcessors,
          };

    return {
        resource: resourceFromAttributes({
            'service.name': 'vendure',
            'service.version': VENDURE_VERSION,
            'service.namespace': 'vendure',
            'service.environment': process.env.NODE_ENV || 'development',
        }),
        ...devModeAwareConfig,
        contextManager: new AsyncLocalStorageContextManager(),
        instrumentations: instrumentationEnabled ? [getNodeAutoInstrumentations()] : [],
        ...rest,
    };
}
