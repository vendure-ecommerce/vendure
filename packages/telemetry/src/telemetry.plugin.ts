import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { OtelInstrumentationStrategy } from './config/otel-instrumentation-strategy';

@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.systemOptions.instrumentationStrategy = new OtelInstrumentationStrategy();
        return config;
    },
})
export class TelemetryPlugin {}
