import { PluginCommonModule, ProductService, VendurePlugin } from '@vendure/core';

import { OtelInstrumentationStrategy } from './config/otel-instrumentation-strategy';
import { SpanAttributeService } from './service/span-attribute.service';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [SpanAttributeService],
    configuration: config => {
        config.systemOptions.instrumentationStrategy = new OtelInstrumentationStrategy();
        return config;
    },
})
export class TelemetryPlugin {
    constructor(spanAttributeService: SpanAttributeService) {
        spanAttributeService.registerHooks(ProductService, {
            findOne: {
                pre([ctx, productId], setAttribute) {
                    setAttribute('productId', productId);
                },
                post(product, setAttribute) {
                    setAttribute('found', !!product);
                },
            },
        });
    }
}
